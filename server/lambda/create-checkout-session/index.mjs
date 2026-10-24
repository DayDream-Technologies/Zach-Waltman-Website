import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Keep these in sync with src/lib/donations.js.
const FEE_RATE = 0.022;
const FEE_FIXED_CENTS = 30;
const MIN_GIFT_CENTS = 500;
const MAX_GIFT_CENTS = 10000000;
const FREQUENCIES = new Set(['one_time', 'monthly', 'annual']);
const DESIGNATIONS = new Set(['where_needed', 'safe_spaces', 'education', 'peer_support']);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  maxNetworkRetries: 2,
});

function headers() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: headers(),
    body: JSON.stringify(body),
  };
}

function methodOf(event) {
  return event.requestContext?.http?.method || event.httpMethod || 'GET';
}

function estimateChargeCents(giftCents) {
  return Math.ceil((giftCents + FEE_FIXED_CENTS) / (1 - FEE_RATE));
}

function readJson(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  return JSON.parse(raw);
}

function invalid(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validate(input) {
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const giftAmountCents = Number(input.giftAmountCents);
  const frequency = String(input.frequency || '');
  const designation = String(input.designation || 'where_needed');
  const coverFees = Boolean(input.coverFees);
  const campaignSlug = input.campaignSlug ? String(input.campaignSlug) : null;

  if (name.length < 2 || name.length > 120) throw invalid('Name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    throw invalid('A valid email is required.');
  }
  if (!Number.isInteger(giftAmountCents) || giftAmountCents < MIN_GIFT_CENTS || giftAmountCents > MAX_GIFT_CENTS) {
    throw invalid('Gift amount is out of range.');
  }
  if (!FREQUENCIES.has(frequency)) throw invalid('Frequency is not supported.');
  if (!DESIGNATIONS.has(designation)) throw invalid('Designation is not supported.');

  const chargedAmountCents = coverFees ? estimateChargeCents(giftAmountCents) : giftAmountCents;
  return {
    name,
    email,
    giftAmountCents,
    feeCents: chargedAmountCents - giftAmountCents,
    chargedAmountCents,
    coverFees,
    frequency,
    designation,
    campaignSlug,
  };
}

export const handler = async (event) => {
  if (methodOf(event) === 'OPTIONS') return response(204, {});
  if (methodOf(event) !== 'POST') return response(405, { error: 'Method not allowed.' });

  if (!process.env.STRIPE_SECRET_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return response(500, { error: 'Donation service is not configured.' });
  }

  let gift;
  try {
    gift = validate(readJson(event));
  } catch (error) {
    if (error.statusCode === 400) return response(400, { error: error.message });
    return response(400, { error: 'Could not read the donation.' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let campaignId = null;
  if (gift.campaignSlug) {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id')
      .eq('slug', gift.campaignSlug)
      .eq('active', true)
      .maybeSingle();
    campaignId = campaign?.id ?? null;
  }

  const { data: donation, error: insertError } = await supabase
    .from('donations')
    .insert({
      donor_name: gift.name,
      donor_email: gift.email,
      gift_amount_cents: gift.giftAmountCents,
      fee_cents: gift.feeCents,
      charged_amount_cents: gift.chargedAmountCents,
      cover_fees: gift.coverFees,
      frequency: gift.frequency,
      designation: gift.designation,
      campaign_id: campaignId,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertError || !donation) {
    console.error('donation insert failed', insertError?.code || 'unknown');
    return response(500, { error: 'Could not record the gift. Nothing was charged.' });
  }

  const siteUrl = (process.env.SITE_URL || event.headers?.origin || 'http://localhost:5173').replace(/\/$/, '');
  const recurring = gift.frequency === 'monthly' || gift.frequency === 'annual';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: recurring ? 'subscription' : 'payment',
      customer_email: gift.email,
      client_reference_id: donation.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: gift.chargedAmountCents,
            product_data: {
              name: recurring
                ? 'Recurring donation to the Zach Waltman Foundation'
                : 'Donation to the Zach Waltman Foundation',
            },
            ...(recurring
              ? { recurring: { interval: gift.frequency === 'monthly' ? 'month' : 'year' } }
              : {}),
          },
        },
      ],
      metadata: {
        donation_id: donation.id,
        designation: gift.designation,
        frequency: gift.frequency,
      },
      ...(recurring
        ? {
            subscription_data: {
              metadata: {
                donation_id: donation.id,
                designation: gift.designation,
                frequency: gift.frequency,
              },
            },
          }
        : {}),
      success_url: `${siteUrl}/donate?status=success`,
      cancel_url: `${siteUrl}/donate?canceled=1`,
    });

    await supabase
      .from('donations')
      .update({
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', donation.id);

    return response(200, { url: session.url, donationId: donation.id });
  } catch (error) {
    console.error('checkout session failed', donation.id);
    await supabase
      .from('donations')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', donation.id);
    return response(502, { error: error.message || 'Stripe could not start checkout.' });
  }
};
