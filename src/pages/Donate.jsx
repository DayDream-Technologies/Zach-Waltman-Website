import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Field from '../components/Field.jsx';
import PageHero from '../components/PageHero.jsx';
import PlaceholderNote from '../components/PlaceholderNote.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { designations, impactForAmount, site } from '../data/site.js';
import {
  FEE_FIXED_CENTS,
  FEE_RATE,
  MAX_GIFT_CENTS,
  MIN_GIFT_CENTS,
  estimateChargeCents,
  formatDollars,
  isDonationConfigured,
  startDonation,
} from '../lib/donations.js';

const presets = [2500, 5000, 10000, 25000];
const frequencies = [
  { id: 'one_time', label: 'One time' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Annual' },
];

function parseDollars(value) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (!cleaned) return 0;
  const [whole, frac = ''] = cleaned.split('.');
  const dollars = Number(whole || '0');
  const cents = Number((frac + '00').slice(0, 2));
  if (!Number.isFinite(dollars) || !Number.isFinite(cents)) return 0;
  return dollars * 100 + cents;
}

export default function Donate() {
  usePageTitle('Donate');
  const [params] = useSearchParams();
  const configured = isDonationConfigured();
  const [preset, setPreset] = useState(5000);
  const [custom, setCustom] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [frequency, setFrequency] = useState('one_time');
  const [designation, setDesignation] = useState('where_needed');
  const [coverFees, setCoverFees] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [serverError, setServerError] = useState('');

  const giftCents = useCustom ? parseDollars(custom) : preset;
  const coveredChargeCents = estimateChargeCents(giftCents);
  const coveredFeeCents = giftCents > 0 ? Math.max(0, coveredChargeCents - giftCents) : 0;
  const chargeCents = coverFees ? coveredChargeCents : giftCents;
  const feeCents = coverFees ? coveredFeeCents : 0;
  const impact = useMemo(() => impactForAmount(giftCents), [giftCents]);
  const succeeded = params.get('status') === 'success';
  const canceled = params.get('canceled') === '1';

  function validate() {
    const next = {};
    if (!name.trim() || name.trim().length < 2) next.name = 'Please add the name for the receipt.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter the email that should receive the receipt.';
    if (giftCents < MIN_GIFT_CENTS) next.amount = 'The minimum gift is $5.';
    if (giftCents > MAX_GIFT_CENTS) next.amount = `For a gift over $100,000, email the family at ${site.email}.`;
    return next;
  }

  async function onDonate(event) {
    event.preventDefault();
    setServerError('');
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    if (!configured) {
      setFallback(true);
      return;
    }
    setSubmitting(true);
    try {
      await startDonation({
        name: name.trim(),
        email: email.trim(),
        giftAmountCents: giftCents,
        frequency,
        designation,
        coverFees,
      });
    } catch (error) {
      setServerError(error.message || 'Could not start checkout.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Donate" title="A gift toward care a student can reach tonight.">
        <p>
          Card checkout on this site records your name and email before you pay, then confirms the gift from Stripe, then sends the foundation’s own acknowledgment. Until that path is switched on, the family’s fundraiser is the way to give.
        </p>
      </PageHero>

      <section className="container-page py-12">
        {succeeded ? (
          <p className="mb-6 rounded-2xl bg-evergreen-800 px-5 py-4 text-sm text-white" role="status">
            Thank you. If the payment finished, the foundation’s acknowledgment will come from its own email, separate from any receipt Stripe sends. If you closed the window early, no gift was recorded as paid.
          </p>
        ) : null}
        {canceled ? (
          <p className="mb-6 rounded-2xl border border-evergreen-200 bg-white px-5 py-4 text-sm text-evergreen-800" role="status">
            No charge was made. You can try again whenever you are ready.
          </p>
        ) : null}
        {!configured ? (
          <p className="mb-6 rounded-2xl border border-dashed border-evergreen-400 bg-evergreen-50 px-5 py-4 text-sm text-evergreen-900">
            Direct giving is coming soon. The button below will take you to the family’s GoFundMe until Stripe is connected.
          </p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="card space-y-6 p-6 sm:p-8" onSubmit={onDonate} noValidate>
            <fieldset>
              <legend className="text-sm font-medium text-evergreen-900">Amount</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {presets.map((cents) => (
                  <button
                    key={cents}
                    type="button"
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                      !useCustom && preset === cents
                        ? 'border-evergreen-800 bg-evergreen-800 text-white'
                        : 'border-evergreen-200 bg-white text-evergreen-900'
                    }`}
                    aria-pressed={!useCustom && preset === cents}
                    onClick={() => {
                      setUseCustom(false);
                      setPreset(cents);
                    }}
                  >
                    {formatDollars(cents)}
                  </button>
                ))}
              </div>
              <label className="mt-3 block">
                <span className="sr-only">Custom amount in dollars</span>
                <input
                  inputMode="decimal"
                  className={`field-input ${errors.amount ? 'field-input-error' : ''}`}
                  placeholder="Other amount"
                  value={custom}
                  onChange={(event) => {
                    setCustom(event.target.value);
                    setUseCustom(true);
                  }}
                  onFocus={() => setUseCustom(true)}
                />
              </label>
              {errors.amount ? <p className="mt-2 text-sm text-red-800">{errors.amount}</p> : null}
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-evergreen-900">Frequency</legend>
              <div className="mt-3 inline-flex rounded-full bg-cream p-1" role="group">
                {frequencies.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      frequency === item.id ? 'bg-evergreen-800 text-white' : 'text-evergreen-800'
                    }`}
                    aria-pressed={frequency === item.id}
                    onClick={() => setFrequency(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field id="designation" label="Designation">
              <select
                id="designation"
                className="field-input"
                value={designation}
                onChange={(event) => setDesignation(event.target.value)}
              >
                {designations.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </Field>

            <label className="flex items-start gap-3 text-sm text-evergreen-800">
              <input
                type="checkbox"
                className="mt-1"
                checked={coverFees}
                onChange={(event) => setCoverFees(event.target.checked)}
              />
              <span>
                Add {giftCents > 0 ? formatDollars(coveredFeeCents) : 'the card fee'} so processing does not shrink the gift.
                The planning rate is {(FEE_RATE * 100).toFixed(1)}% + {formatDollars(FEE_FIXED_CENTS)}, and it applies only after Stripe approves a nonprofit discount. Confirm the live rate before launch.
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="donor-name" label="Name" error={errors.name}>
                <input id="donor-name" className={`field-input ${errors.name ? 'field-input-error' : ''}`} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
              </Field>
              <Field id="donor-email" label="Email" error={errors.email}>
                <input id="donor-email" type="email" className={`field-input ${errors.email ? 'field-input-error' : ''}`} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
              </Field>
            </div>
            <p className="text-xs leading-relaxed text-evergreen-600">
              We ask for this before payment so an unfinished checkout is still a name and an intended amount, not a blank. Card numbers are entered on Stripe, not on this site.
            </p>

            {serverError ? <p className="text-sm text-red-800">{serverError}</p> : null}

            <button type="submit" className="btn-primary" disabled={submitting}>
              <Heart className="h-4 w-4" />
              {submitting ? 'Starting checkout…' : configured ? `Give ${formatDollars(chargeCents || 0)}` : 'Continue to the fundraiser'}
            </button>

            {fallback ? (
              <div className="rounded-2xl bg-evergreen-50 p-5" role="status">
                <h2 className="font-display text-xl font-semibold text-evergreen-950">Direct giving is not switched on yet</h2>
                <p className="mt-2 text-sm leading-relaxed text-evergreen-800">
                  Your name and amount were not sent anywhere. The family’s GoFundMe is the interim way to give. Gifts there follow GoFundMe’s terms, not a receipt from this foundation.
                </p>
                <a className="btn-primary mt-4" href={site.gofundme} target="_blank" rel="noreferrer">
                  Open the GoFundMe
                </a>
              </div>
            ) : null}
          </form>

          <aside className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold">Your gift</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-evergreen-700">Designated gift</dt>
                  <dd className="font-semibold">{formatDollars(giftCents || 0)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-evergreen-700">Frequency</dt>
                  <dd className="font-semibold capitalize">{frequency.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-evergreen-700">Processing, if you cover it</dt>
                  <dd className="font-semibold">{coverFees ? formatDollars(feeCents) : '$0.00'}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-evergreen-100 pt-2 text-base">
                  <dt className="font-semibold">Charged</dt>
                  <dd className="font-display text-2xl font-semibold text-evergreen-800">{formatDollars(chargeCents || 0)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-evergreen-700">{impact}</p>
              <PlaceholderNote>Impact lines are illustrative, not a budget.</PlaceholderNote>
            </div>
            <p className="px-1 text-xs leading-relaxed text-evergreen-600">
              Tax status and the EIN are not published yet. Do not assume a gift is deductible until the foundation states that it is a 501(c)(3) and puts the EIN on the acknowledgment. This is not tax advice.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-display text-3xl font-semibold">Donor-advised funds and gifts of stock</h2>
          <p className="mt-3 text-sm leading-relaxed text-evergreen-800">
            A gift from a donor-advised fund, or a donation of stock, should not go through the card form, and it should not receive a personal tax receipt from this page. Donor-advised fund and stock donors should contact the family directly. They will share how to send the gift.
          </p>
          <p className="mt-4">
            <a
              className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-4"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
