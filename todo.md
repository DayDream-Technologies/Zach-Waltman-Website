# Still needed

The site is a working front end with placeholder copy where the foundation does not have material yet. Gifts on the donate page go through the Zeffy form.

Items marked **needed** block an honest public launch. Items marked **nice** can wait.

## Content

- [ ] **Needed.** Family-written telling of Zach’s life, in their words, to replace the short public-record version on Zach’s Story. Confirm or correct: Wilmette, Loyola Academy hockey, number 84, Michigan State finance, Phi Gamma Delta (FIJI), September 16, 2026, age 22, and the phrase “a brief but severe battle with depression.”
- [ ] **Needed.** Photographs the family approves, with credit and where each may be used (site, social, print). The gallery frames are empty on purpose.
- [ ] **Needed.** A short video, if one should exist: who speaks, how long, and whether it is captioned.
- [ ] **Needed.** Quotes the family wants published. The quotes on Zach’s Story are the ones in use now.
- [ ] **Needed.** Memories from friends and teammates, with permission. The memory form emails the family.
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
- [ ] **Needed.** Privacy policy: what the forms collect and how long it is kept.
- [ ] **Needed.** Terms of use, and a donation and refund policy. Gifts on this site go through the Zeffy form.
- [ ] **Nice.** Gift acceptance policy for stock, donor-advised funds, and grants.
- [ ] **Nice.** Insurance and volunteer waiver, before the volunteer form is connected.

## Donations

Gifts on the donate page go through the Zeffy form embedded on that page. Donor-advised funds and gifts of stock are handled by email, not through that form.

- [ ] **Needed.** Confirm the Zeffy form is the live campaign and that receipts from Zeffy match what the foundation wants donors to receive.
- [ ] **Needed.** Counsel signs off on how Zeffy acknowledgments treat deductibility while 501(c)(3) status is still being confirmed.

## Forms

Volunteer, newsletter, memory, and donor-advised-fund forms validate in the browser and then stop. They say so on the page. A success message that implied the note was received would be a lie, so they don’t.

- [ ] **Needed.** Confirm volunteer notes and memories are reaching the foundation inbox. Include the memory form’s “you may share this” checkbox in what gets saved.
- [ ] **Needed.** A public inbox that a human reads, and a sentence on the site about how soon someone replies.
- [ ] **Needed.** Spam control (a honeypot is enough at this size) before the forms are public and connected.
- [ ] **Nice.** Newsletter tool (Buttondown, Resend audiences, or similar) with a real confirm-opt-in.
- [ ] **Nice.** Export of volunteers for whoever is coordinating them.

## Domain, hosting, and accounts

- [ ] **Needed.** A domain. Canonical and social-preview URLs in `index.html` are relative until one exists.
- [ ] **Needed.** Hosting. `amplify-redirects.json` is the single-page rewrite used so routes like `/donate` don’t 404 on refresh. Attach it in the Amplify console (or the equivalent on whatever host you pick).
- [ ] **Needed.** The public site origin set for hosting, not left as localhost.
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
- [ ] Search console, uptime check, and a status note if the donation form is down.

## Safe-messaging reminders for whoever edits copy

- Do not describe how Zach died, and do not add detail if a later source offers it.
- Keep 988 (call or text) and Crisis Text Line (text HOME to 741741) visible. The banner can be dismissed for one visit. The footer can bring it back.
- Do not publish a campus “safe space” as if it were open. The vision is 24/7 and fully staffed. It is not built yet.
- Do not publish a dollar total on this site as if it were the foundation’s books. Let the donation form show its own total.
