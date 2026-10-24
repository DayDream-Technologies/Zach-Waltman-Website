import Stripe from 'https://esm.sh/stripe@17.4.0?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function idOf(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value && 'id' in value && typeof value.id === 'string') {
    return value.id;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const signature = req.headers.get('stripe-signature');
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
  if (!signature || !secret) return json({ error: 'Webhook is not configured.' }, 500);

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      secret,
      undefined,
      cryptoProvider,
    );
  } catch (_error) {
    return json({ error: 'Invalid signature.' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: seen } = await supabase
    .from('donation_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .maybeSingle();
  if (seen) return json({ received: true, duplicate: true });

  let donationId: string | null = null;

  try {
    donationId = await applyEvent(supabase, event);
  } catch (error) {
    console.error('webhook apply failed', event.id, error instanceof Error ? error.message : 'error');
    return json({ error: 'Could not record the event.' }, 500);
  }

  const { error: logError } = await supabase.from('donation_events').insert({
    donation_id: donationId,
    event_type: event.type,
    stripe_event_id: event.id,
    payload: event,
  });
  if (logError && logError.code !== '23505') {
    console.error('event log failed', event.id, logError.code);
    return json({ error: 'Could not log the event.' }, 500);
  }

  return json({ received: true });
});

async function applyEvent(supabase: ReturnType<typeof createClient>, event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      return completeCheckout(supabase, event.data.object as Stripe.Checkout.Session);
    case 'invoice.paid':
      return recordRenewal(supabase, event.data.object as Stripe.Invoice);
    case 'charge.refunded':
      return recordRefund(supabase, event.data.object as Stripe.Charge);
    case 'checkout.session.expired':
      return expireCheckout(supabase, event.data.object as Stripe.Checkout.Session);
    default:
      return null;
  }
}

async function completeCheckout(supabase: ReturnType<typeof createClient>, session: Stripe.Checkout.Session) {
  const donationId = session.metadata?.donation_id;
  if (!donationId) throw new Error('Checkout session is missing donation_id.');

  const { data, error } = await supabase.rpc('mark_donation_succeeded', {
    donation: donationId,
    session_id: session.id,
    payment_intent: idOf(session.payment_intent),
    subscription_id: idOf(session.subscription),
    customer_id: idOf(session.customer),
  });
  if (error) throw new Error(error.message);

  if (data?.status === 'succeeded' && data?.receipt_number && !data?.receipt_sent_at) {
    await requestReceipt(data.id);
  }
  return donationId;
}

async function recordRenewal(supabase: ReturnType<typeof createClient>, invoice: Stripe.Invoice) {
  if (invoice.billing_reason !== 'subscription_cycle') return null;

  const subscriptionId = idOf(invoice.subscription);
  const invoiceId = invoice.id;
  if (!subscriptionId || !invoiceId) throw new Error('Renewal invoice is missing ids.');

  const { data: existing } = await supabase
    .from('donations')
    .select('id, status, receipt_number, receipt_sent_at')
    .eq('stripe_invoice_id', invoiceId)
    .maybeSingle();
  if (existing) {
    if (existing.status === 'pending') {
      const { error: finishError } = await supabase.rpc('mark_donation_succeeded', {
        donation: existing.id,
        session_id: null,
        payment_intent: idOf(invoice.payment_intent),
        subscription_id: subscriptionId,
        customer_id: idOf(invoice.customer),
      });
      if (finishError) throw new Error(finishError.message);
      const { data: finished } = await supabase
        .from('donations')
        .select('id, receipt_number, receipt_sent_at, status')
        .eq('id', existing.id)
        .single();
      if (finished?.status === 'succeeded' && finished.receipt_number && !finished.receipt_sent_at) {
        await requestReceipt(finished.id);
      }
    } else if (existing.status === 'succeeded' && existing.receipt_number && !existing.receipt_sent_at) {
      await requestReceipt(existing.id);
    }
    return existing.id;
  }

  const { data: original, error: lookupError } = await supabase
    .from('donations')
    .select('id, donor_name, donor_email, designation, frequency, campaign_id, cover_fees')
    .eq('stripe_subscription_id', subscriptionId)
    .eq('is_renewal', false)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (lookupError) throw new Error(lookupError.message);
  if (!original) throw new Error('Original subscription gift is not recorded yet.');

  const charged = invoice.amount_paid;
  const { data: created, error } = await supabase
    .from('donations')
    .insert({
      donor_name: original.donor_name,
      donor_email: original.donor_email,
      gift_amount_cents: charged,
      fee_cents: 0,
      charged_amount_cents: charged,
      cover_fees: original.cover_fees,
      frequency: original.frequency,
      designation: original.designation,
      campaign_id: original.campaign_id,
      stripe_invoice_id: invoiceId,
      stripe_subscription_id: subscriptionId,
      stripe_payment_intent_id: idOf(invoice.payment_intent),
      stripe_customer_id: idOf(invoice.customer),
      status: 'pending',
      is_renewal: true,
      parent_donation_id: original.id,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  const { error: finishError } = await supabase.rpc('mark_donation_succeeded', {
    donation: created.id,
    session_id: null,
    payment_intent: idOf(invoice.payment_intent),
    subscription_id: subscriptionId,
    customer_id: idOf(invoice.customer),
  });
  if (finishError) throw new Error(finishError.message);

  const { data: row } = await supabase
    .from('donations')
    .select('id, receipt_number, receipt_sent_at, status')
    .eq('id', created.id)
    .single();
  if (row?.status === 'succeeded' && row.receipt_number && !row.receipt_sent_at) {
    await requestReceipt(row.id);
  }
  return created.id;
}

async function recordRefund(supabase: ReturnType<typeof createClient>, charge: Stripe.Charge) {
  const paymentIntent = idOf(charge.payment_intent);
  if (!paymentIntent) return null;
  const { data, error } = await supabase
    .from('donations')
    .update({
      status: 'refunded',
      refunded_amount_cents: charge.amount_refunded,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent)
    .select('id')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.id ?? null;
}

async function expireCheckout(supabase: ReturnType<typeof createClient>, session: Stripe.Checkout.Session) {
  const donationId = session.metadata?.donation_id;
  if (!donationId) return null;
  const { error } = await supabase
    .from('donations')
    .update({ status: 'expired', updated_at: new Date().toISOString() })
    .eq('id', donationId)
    .eq('status', 'pending');
  if (error) throw new Error(error.message);
  return donationId;
}

async function requestReceipt(donationId: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const response = await fetch(`${supabaseUrl}/functions/v1/send-receipt`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ donation_id: donationId }),
  });
  if (!response.ok) {
    console.error('receipt request failed', donationId, response.status);
  }
}
