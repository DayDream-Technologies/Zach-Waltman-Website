export const FEE_RATE = 0.022;
export const FEE_FIXED_CENTS = 30;
export const MIN_GIFT_CENTS = 500;
export const MAX_GIFT_CENTS = 10000000;

export function isDonationConfigured() {
  return Boolean(import.meta.env.VITE_DONATION_FUNCTION_URL);
}

/** Gross-up so a covered fee still nets the chosen gift after 2.2% + $0.30. */
export function estimateChargeCents(giftCents) {
  if (!Number.isFinite(giftCents) || giftCents <= 0) return 0;
  return Math.ceil((giftCents + FEE_FIXED_CENTS) / (1 - FEE_RATE));
}

export function formatDollars(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export async function startDonation(payload) {
  const url = import.meta.env.VITE_DONATION_FUNCTION_URL;
  if (!url) return { configured: false };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Could not start checkout.');
  }
  if (data.url) {
    window.location.assign(data.url);
  }
  return { configured: true, ...data };
}
