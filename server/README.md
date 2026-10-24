# Donation services

This is the backend sketched in the Wasilewski Holdings article on automating nonprofit donations. Nothing here is connected until the keys in `.env.example` exist. The website keeps linking to the family GoFundMe until `VITE_DONATION_FUNCTION_URL` is set and the site is rebuilt.

Card numbers stay on Stripe Checkout. The charity database stores the intent first. The signed webhook, not the browser, marks a gift succeeded. Resend sends the charity’s acknowledgment. A Stripe receipt is not that letter.

## 1. Stripe

Create an account for the foundation. Apply for the nonprofit processing discount before treating 2.2% + $0.30 as the rate. That rate is only for qualifying 501(c)(3) donation volume after Stripe approves it.

Use test keys until a live gift is intentional. Put the secret key in `STRIPE_SECRET_KEY` for Lambda and for the webhook function.

## 2. Supabase

Create a project. Run `supabase/migrations/0001_donations.sql` in the SQL editor, or with the Supabase CLI. The tables have row level security and no public policies. Only the service role, used by Lambda and the Edge Functions, can read and write them.

Deploy the functions from this repo:

```bash
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy send-receipt
```

`supabase/config.toml` already sets `verify_jwt = false` for the webhook, because Stripe does not send a Supabase token. The function checks the Stripe signature instead. `send-receipt` keeps JWT verification and also requires the `service_role` claim.

Set secrets on the project: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RECEIPT_FROM`, `LEGAL_NAME`, `EIN`. Supabase injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into Edge Functions. Do not put the service role key in the React app.

Leave `EIN` as `PENDING` until counsel confirms the legal name and employer identification number. `send-receipt` will not email while the EIN is empty or still says pending. Payments can still be recorded. Receipts wait.

In the Stripe Dashboard, add a webhook endpoint aimed at:

`https://<project-ref>.supabase.co/functions/v1/stripe-webhook`

Subscribe to:

- `checkout.session.completed`
- `invoice.paid` (renewals; the first invoice is ignored so it is not recorded twice)
- `charge.refunded`
- `checkout.session.expired`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`. Until that secret is installed, completed payments stay `pending`.

## 3. Lambda

From `server/lambda/create-checkout-session`:

```bash
npm install
zip -r function.zip index.mjs node_modules package.json
```

Create a Node.js 20 function with that zip. Add a Function URL, auth type NONE, and CORS that allows `POST` from the site origin. Set the same environment variables listed in `.env.example`: `STRIPE_SECRET_KEY`, `SITE_URL`, `ALLOWED_ORIGIN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

The handler writes a `pending` donations row, then creates a Checkout Session with that row’s id in `metadata` and, for monthly or annual gifts, on `subscription_data.metadata`. One-time gifts use `mode: payment`. Recurring gifts use `mode: subscription` and `price_data` on a single donation product.

Put the Function URL in `VITE_DONATION_FUNCTION_URL` and rebuild the site. The donate button then redirects to Checkout. While the variable is blank, the button explains that direct giving is not on and links to the GoFundMe.

## 4. Resend

Verify the foundation’s domain and set `RECEIPT_FROM` to an address on it. The free plan is about 3,000 emails a month and 100 a day. The daily cap is the first limit this design will hit. A day with more than 100 card gifts needs a paid mail plan.

The letter includes the legal name, EIN, amount, date, frequency, designation, receipt number, and a statement that no goods or services were provided. Monthly and annual gifts say so in the body. Donor-advised funds and grants stay on the staff form. They do not get this email.

## 5. If a webhook is missed

Do not trust the success page. In the Stripe Dashboard, resend the event, or compare succeeded charges with rows still `pending`:

```sql
select id, donor_email, charged_amount_cents, stripe_checkout_session_id, created_at
from public.donations
where status = 'pending'
  and created_at < now() - interval '1 hour';
```

Match `stripe_checkout_session_id` to the Checkout Session. If Stripe shows the session complete, you can call `mark_donation_succeeded` with the ids from that session, then invoke `send-receipt` with the service role. Do not mark a row succeeded from the browser redirect alone.

Campaign totals add `gift_amount_cents` (the designated gift), not the extra amount a donor adds to cover fees. Confirm that split with whoever keeps the books before the first campaign is published.
