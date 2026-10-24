# Still needed

The site is a working front end with placeholder copy where the foundation does not have material yet. Donation code is written and unwired. Nothing in the donation path should be treated as live until the boxes below are checked.

Items marked **needed** block an honest public launch. Items marked **nice** can wait.

## Content

- [ ] **Needed.** Family-written telling of Zach’s life, in their words, to replace the short public-record version on Zach’s Story. Confirm or correct: Wilmette, Loyola Academy hockey, number 84, Michigan State finance, Phi Gamma Delta (FIJI), September 16, 2026, age 22, and the phrase “a brief but severe battle with depression.”
- [ ] **Needed.** Photographs the family approves, with credit and where each may be used (site, social, print). The gallery frames are empty on purpose.
- [ ] **Needed.** A short video, if one should exist: who speaks, how long, and whether it is captioned.
- [ ] **Needed.** Quotes the family wants published. The GoFundMe sentences are the only ones used now.
- [ ] **Needed.** Memories from friends and teammates, with permission. The memory form does not send.
- [ ] **Needed.** Board and staff names, roles, short bios, and headshots. Seats on the About page are unlabeled on purpose. Do not invent people.
- [ ] **Needed.** A clinician’s review of every draft guide, the “how to help a friend” section, and the breathing exercise, before any of it is described as the foundation’s advice.
- [ ] **Needed.** Real impact numbers, once a program has them. The home page counters are the aim (24/7, one student, number 84), not results.
- [ ] **Needed.** Real events: title, place, start, end, who is hosting, and whether the public should attend. Every card on the Events page is a sample and says so.
- [ ] **Needed.** Partner campuses and the after-hours counseling number each one wants listed.
- [ ] **Needed.** A vetted resource list beyond the national lines already linked (988, Crisis Text Line, Cognition Daily, NAMI HelpLine, SAMHSA, The Jed Foundation, AFSP, NCAA). Re-check every URL before launch.
- [ ] **Nice.** Stories from students or families, with written consent and no graphic detail.
- [ ] **Nice.** A letter from the family for the top of the home page.
- [ ] **Nice.** Jersey, rink, or campus details the family wants remembered (position, years, teammates) if they want more than “wore 84.”
- [ ] **Nice.** A news or notes section, once there is something to report.

## Legal and the organization

- [ ] **Needed.** Confirm 501(c)(3) status, the legal name, and the EIN. The site does not claim deductibility until that is true.
- [ ] **Needed.** State of incorporation, registered address, and the name of a responsible person for the site footer.
- [ ] **Needed.** A public email and, if you want one, a phone number. None is invented here.
- [ ] **Needed.** Privacy policy: what the forms collect, how long it is kept, and that unfinished checkouts are stored on purpose.
- [ ] **Needed.** Terms of use, and a donation and refund policy (including how to cancel a monthly or annual gift).
- [ ] **Needed.** Counsel reviews the receipt letter in `supabase/functions/send-receipt/index.ts` against the current IRS written-acknowledgment rules (Publication 1771). The draft states the name, EIN, amount, date, and that no goods or services were provided.
- [ ] **Needed.** A decision on whether gifts that cover card fees are receipted as the full charged amount. The draft does that.
- [ ] **Nice.** Gift acceptance policy for stock, donor-advised funds, and grants.
- [ ] **Nice.** Insurance and volunteer waiver, before the volunteer form is connected.

## Donations

The shape follows the article at wasilewskiholdings.com/resources/automating-nonprofit-donations: record intent, take the card on Stripe Checkout, treat the signed webhook as the ledger, mail the charity’s own acknowledgment. Steps are in [server/README.md](server/README.md). Code is in `server/lambda/create-checkout-session`, `supabase/migrations/0001_donations.sql`, `supabase/functions/stripe-webhook`, and `supabase/functions/send-receipt`.

- [ ] **Needed.** Stripe account in the foundation’s name. Start in test mode.
- [ ] **Needed.** Apply for Stripe’s nonprofit discount before using 2.2% + $0.30 as the operating rate. The donate page says this rate is a planning figure.
- [ ] **Needed.** Supabase project. Run the migration. Keep the service-role key off the website.
- [ ] **Needed.** Deploy the Lambda, give it a Function URL, and set `VITE_DONATION_FUNCTION_URL`, then rebuild. Until that variable is set, Donate links to the family GoFundMe instead of charging a card.
- [ ] **Needed.** Deploy `stripe-webhook` with JWT verification off, and `send-receipt` with it on. Point Stripe at the webhook. Subscribe to `checkout.session.completed`, `invoice.paid`, `charge.refunded`, and `checkout.session.expired`.
- [ ] **Needed.** Install `STRIPE_WEBHOOK_SECRET`. Without it, paid gifts stay `pending`.
- [ ] **Needed.** Resend account, domain verified, `RECEIPT_FROM` on that domain. The free plan is about 100 emails a day. That is the first ceiling. Budget a paid plan before a campaign that could pass it.
- [ ] **Needed.** Set `LEGAL_NAME` and a real `EIN`. The receipt function refuses to send while the EIN is empty or still says `PENDING`.
- [ ] **Needed.** Counsel signs off on the receipt copy, including the monthly and annual sentences.
- [ ] **Needed.** Decide whether covered fees count toward a campaign total. The database adds `gift_amount_cents` only (the designated gift), not the fee the donor added.
- [ ] **Needed.** A reconcile habit for missed webhooks. A query is in `server/README.md`. Resend the Stripe event, or call `mark_donation_succeeded` from the session, then `send-receipt`. Do not mark a gift paid because the browser said thank you.
- [ ] **Needed.** End-to-end test in Stripe test mode: one-time gift, abandoned checkout (row stays pending), monthly gift, a renewal `invoice.paid`, a refund, and an expired session.
- [ ] **Needed.** Remove the GoFundMe fallback, or keep it as a second path on purpose, once card gifts work. The campaign is `https://www.gofundme.com/f/zach-waltman-mental-health-crisis-campus-suicide-prevention`.
- [ ] **Needed.** Confirm the live Stripe invoice object still exposes `payment_intent` on the API version you pin. Renewals and refunds use it. If Stripe has moved that field, update `supabase/functions/stripe-webhook/index.ts` before the first recurring gift.
- [ ] **Nice.** An admin screen for pending gifts, refunds, and unsent receipts. There is no login on this site.
- [ ] **Nice.** Donor portal to change a card or cancel a schedule without emailing staff.
- [ ] **Nice.** Year-end gift summary, separate from the per-gift letter.
- [ ] **Nice.** Campaign rows in the `campaigns` table, once a real campaign has a name and a goal. The form can already pass `campaignSlug`. Nothing on the site sends one yet.

## Forms

Volunteer, newsletter, memory, and donor-advised-fund forms validate in the browser and then stop. They say so on the page. A success message that implied the note was received would be a lie, so they don’t.

- [ ] **Needed.** A place those notes go: a Supabase table plus an email through Resend, or a form service. Include the memory form’s “you may share this” checkbox in whatever you store.
- [ ] **Needed.** A public inbox that a human reads, and a sentence on the site about how soon someone replies.
- [ ] **Needed.** Spam control (a honeypot is enough at this size) before the forms are public and connected.
- [ ] **Nice.** Newsletter tool (Buttondown, Resend audiences, or similar) with a real confirm-opt-in.
- [ ] **Nice.** Export of volunteers for whoever is coordinating them.

## Domain, hosting, and accounts

- [ ] **Needed.** A domain. Canonical and social-preview URLs in `index.html` are relative until one exists.
- [ ] **Needed.** Hosting. `amplify-redirects.json` is the single-page rewrite used so routes like `/donate` don’t 404 on refresh. Attach it in the Amplify console (or the equivalent on whatever host you pick).
- [ ] **Needed.** `SITE_URL` and `ALLOWED_ORIGIN` set to that origin, not localhost.
- [ ] **Nice.** Analytics that does not drop a marketing pixel on a crisis page without a decision. If you add any, say so in the privacy policy.
- [ ] **Nice.** Social accounts and the handles to put in the footer. The share buttons currently share this website, not a profile.
- [ ] **Nice.** A proper favicon and apple-touch icon cropped from the logo, instead of the full lockup.
- [ ] **Nice.** Open Graph image made for sharing, not the logo file alone.
- [ ] **Nice.** `sitemap.xml` and a real canonical host.

## Nice to have on the site itself

- [ ] Merchandise, if you want it, on a store that is not this donation flow. A jersey is not a charitable contribution in the same way a gift is.
- [ ] Campus ambassador program: what they do, how they are trained, and who supervises them.
- [ ] Spanish (and any other language the first campuses need), including the 988 banner. 988 itself already offers Spanish.
- [ ] Accessibility pass with a keyboard and a screen reader: menu, donate form, accordion, flip cards, breathing exercise. Reduced motion is respected in the big transitions. Have someone confirm it.
- [ ] A plain-language reading pass. The audience includes students in distress and parents who are scared. Short sentences matter more than a clever headline.
- [ ] Search console, uptime check, and a status note if donations are down so the GoFundMe link can be turned back on quickly.

## Safe-messaging reminders for whoever edits copy

- Do not describe how Zach died, and do not add detail if a later source offers it.
- Keep 988 (call or text) and Crisis Text Line (text HOME to 741741) visible. The banner can be dismissed for one visit. The footer can bring it back.
- Do not publish a campus “safe space” as if it were open. The vision is 24/7 and fully staffed. It is not built yet.
- Do not publish a dollar total from the GoFundMe as if it were the foundation’s books. Link to the campaign and let that page show the live number.
