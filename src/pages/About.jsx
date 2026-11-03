import Accordion from '../components/Accordion.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { faqs } from '../data/faqs.js';
import { site } from '../data/site.js';
// Commented out with How care should move, Values, and People. Restore with those sections.
// import { motion } from 'framer-motion';
// import PlaceholderNote from '../components/PlaceholderNote.jsx';
// import Reveal from '../components/Reveal.jsx';
// import { boardSeats, careSteps, values } from '../data/site.js';

/*
  Introductions removed from the page. Put them back under the matching headings when ready.

  About us: The foundation is new. The mission is not a slogan we are waiting to define. It is the sentence the family is organizing around, and the vision that follows it.

  How care should move: This is the path we want every campus partner to be able to walk. It is a design, not a claim that the rooms are open.

  Values: These are working values for a young organization. The board can revise them. They are not a brand exercise detached from the mission.

  People: Seats are shown so the structure is visible. No names are invented here. Photos and biographies will replace these cards when the family is ready.
*/

export default function About() {
  usePageTitle('About us');

  return (
    <>
      <PageHero eyebrow="About us" title="A more responsive system of care, built in Zach’s name." />

      <section className="container-page grid gap-6 py-16 lg:grid-cols-2">
        <article className="card p-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-evergreen-600">
            Mission
          </h2>
          <p className="mt-4 text-2xl font-medium leading-snug text-evergreen-950">{site.mission} {site.now}</p>
        </article>
        <article className="card bg-evergreen-800 p-8 text-cream">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-evergreen-200">
            Vision
          </h2>
          <p className="mt-4 leading-relaxed text-white">{site.vision}</p>
        </article>
      </section>

      <section className="container-page pb-16">
        <h2 className="font-display text-3xl font-semibold text-evergreen-900">Partnerships</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-evergreen-800">
          This foundation is in collaboration with Michigan State University. The first site is being launched there with Counseling and Psychological Services (CAPS), the university’s counseling office. We also work with Cognition Daily, which helps students and families find local care. The goal is to expand this model from Michigan State to campuses across the country.
        </p>
      </section>

      <section className="container-page pb-4">
        <h2 className="font-display text-3xl font-semibold text-evergreen-900">Why this work is urgent</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-evergreen-800">
          Suicide is the second leading cause of death for people ages 15 to 24 in the United States, and for people ages 25 to 34. In 2024, 5,915 people ages 15 to 24 and 7,993 people ages 25 to 34 died by suicide. Unintentional injury was the only cause ranked higher in those age groups.
        </p>
        <p className="mt-3 text-sm text-evergreen-700">
          <a
            className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2"
            href="https://mvpiccs-viz.cdc.gov/pdfs/leading-causes-of-death-by-age-group_2024_508.pdf"
            target="_blank"
            rel="noreferrer"
          >
            CDC WISQARS, 10 leading causes of death, 2024
          </a>
        </p>
      </section>

      {/*
        How care should move, Values, and People. Restore these sections, and the imports above, when ready.

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="How care should move" title="From a student, to a person, to a plan." />
          <div className="relative mt-10 grid gap-4 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-evergreen-200 md:block" aria-hidden="true" />
            {careSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.1}>
                <article className="relative h-full rounded-3xl border border-evergreen-100 bg-cream p-5">
                  <motion.span
                    className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-evergreen-800 font-display text-sm font-semibold text-white"
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                  >
                    {index + 1}
                  </motion.span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-evergreen-800">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Values" title="Each value, and what it asks of us." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="card flex h-full flex-col p-6">
              <h3 className="font-display text-2xl font-semibold">{value.title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-evergreen-900">{value.front}</p>
              <p className="mt-3 text-sm leading-relaxed text-evergreen-800">{value.back}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="People" title="The board is not named yet." />
        <PlaceholderNote>Board names, headshots, and bios.</PlaceholderNote>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {boardSeats.map((seat) => (
            <article key={seat.role} className="card p-5">
              <div className="flex h-28 items-center justify-center rounded-2xl bg-evergreen-50 font-display text-4xl text-evergreen-300" aria-hidden="true">
                84
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{seat.role}</h3>
              <p className="mt-2 text-sm text-evergreen-700">{seat.note}</p>
            </article>
          ))}
        </div>
      </section>
      */}

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Questions" title="What we can answer today." />
          <div className="mt-8">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
