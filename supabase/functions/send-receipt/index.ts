import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

type Donation = {
  id: string;
  donor_name: string;
  donor_email: string;
  charged_amount_cents: number;
  gift_amount_cents: number;
  cover_fees: boolean;
  fee_cents: number;
  frequency: 'one_time' | 'monthly' | 'annual';
  designation: string | null;
  receipt_number: string | null;
  receipt_sent_at: string | null;
  status: string;
  created_at: string;
  is_renewal: boolean;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isServiceRole(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const payload = token.split('.')[1];
  if (!payload) return false;
  try {
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(padded));
    return decoded.role === 'service_role';
  } catch {
    return false;
  }
}

function money(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function frequencyLabel(frequency: Donation['frequency']) {
  if (frequency === 'monthly') return 'monthly';
  if (frequency === 'annual') return 'annual';
  return 'one-time';
}

function designationLabel(designation: string | null) {
  const labels: Record<string, string> = {
    where_needed: 'Where it is needed most',
    safe_spaces: 'On-campus safe spaces',
    education: 'Education and training',
    peer_support: 'Peer support',
  };
  return labels[designation ?? ''] ?? 'Where it is needed most';
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!isServiceRole(req)) return json({ error: 'Not authorized.' }, 401);

  const ein = (Deno.env.get('EIN') ?? '').trim();
  const legalName = (Deno.env.get('LEGAL_NAME') ?? '').trim();
  const from = (Deno.env.get('RECEIPT_FROM') ?? '').trim();
  const resendKey = Deno.env.get('RESEND_API_KEY') ?? '';
  if (!ein || ein.toUpperCase().includes('PENDING') || !legalName || !from || !resendKey) {
    return json({ error: 'Receipt sender is not configured. Set EIN, LEGAL_NAME, RECEIPT_FROM, and RESEND_API_KEY.' }, 500);
  }

  const { donation_id: donationId } = await req.json().catch(() => ({ donation_id: '' }));
  if (!donationId) return json({ error: 'donation_id is required.' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase
    .from('donations')
    .select('id, donor_name, donor_email, charged_amount_cents, gift_amount_cents, cover_fees, fee_cents, frequency, designation, receipt_number, receipt_sent_at, status, created_at, is_renewal')
    .eq('id', donationId)
    .maybeSingle();
  if (error) return json({ error: error.message }, 500);
  const donation = data as Donation | null;
  if (!donation) return json({ error: 'Donation not found.' }, 404);
  if (donation.status !== 'succeeded') return json({ error: 'Donation is not succeeded.' }, 409);
  if (!donation.receipt_number) return json({ error: 'Receipt number is missing.' }, 409);
  if (donation.receipt_sent_at) return json({ ok: true, alreadySent: true });

  const giftDate = new Date(donation.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  });
  const cadence = frequencyLabel(donation.frequency);
  const amount = money(donation.charged_amount_cents);
  const renewalNote = cadence === 'one-time'
    ? 'This was a one-time contribution.'
    : `This contribution is ${cadence}. A written acknowledgment will be sent for each renewal. You can cancel the schedule from the receipt Stripe emailed you, or by writing to the foundation.`;
  const feeNote = donation.cover_fees
    ? `Of this amount, ${money(donation.gift_amount_cents)} is the designated gift and ${money(donation.fee_cents)} was added to cover card processing.`
    : '';

  const text = [
    `Dear ${donation.donor_name},`,
    '',
    `Thank you. ${legalName} received your contribution.`,
    '',
    `Organization: ${legalName}`,
    `EIN: ${ein}`,
    `Amount: ${amount}`,
    `Date: ${giftDate}`,
    `Frequency: ${cadence}`,
    `Designation: ${designationLabel(donation.designation)}`,
    `Receipt number: ${donation.receipt_number}`,
    feeNote,
    renewalNote,
    '',
    'No goods or services were provided in exchange for this contribution.',
    '',
    'This letter is the charity’s written acknowledgment. A payment receipt from the card processor is not a substitute for it.',
    '',
    'With thanks,',
    legalName,
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family: Georgia, serif; color: #12352d; line-height: 1.5;">
      <p>Dear ${escapeHtml(donation.donor_name)},</p>
      <p>Thank you. ${escapeHtml(legalName)} received your contribution.</p>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 16px 4px 0;">Organization</td><td>${escapeHtml(legalName)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;">EIN</td><td>${escapeHtml(ein)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;">Amount</td><td>${escapeHtml(amount)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;">Date</td><td>${escapeHtml(giftDate)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;">Frequency</td><td>${escapeHtml(cadence)}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;">Designation</td><td>${escapeHtml(designationLabel(donation.designation))}</td></tr>
        <tr><td style="padding: 4px 16px 4px 0;">Receipt number</td><td>${escapeHtml(donation.receipt_number)}</td></tr>
      </table>
      ${feeNote ? `<p>${escapeHtml(feeNote)}</p>` : ''}
      <p>${escapeHtml(renewalNote)}</p>
      <p><strong>No goods or services were provided in exchange for this contribution.</strong></p>
      <p>This letter is the charity’s written acknowledgment. A payment receipt from the card processor is not a substitute for it.</p>
      <p>With thanks,<br>${escapeHtml(legalName)}</p>
    </div>
  `;

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: donation.donor_email,
      subject: `Thank you for your gift to ${legalName} (${donation.receipt_number})`,
      text,
      html,
    }),
  });

  if (!sent.ok) {
    const detail = await sent.text();
    console.error('resend failed', donation.id, sent.status, detail.slice(0, 300));
    return json({ error: 'Email provider rejected the receipt.' }, 502);
  }

  const { error: updateError } = await supabase
    .from('donations')
    .update({ receipt_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', donation.id)
    .is('receipt_sent_at', null);
  if (updateError) return json({ error: updateError.message }, 500);

  return json({ ok: true });
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
