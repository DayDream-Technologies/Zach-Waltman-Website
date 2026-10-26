import { motion } from 'framer-motion';
import Accordion from '../components/Accordion.jsx';
import PageHero from '../components/PageHero.jsx';
import PlaceholderNote from '../components/PlaceholderNote.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { faqs } from '../data/faqs.js';
import { boardSeats, careSteps, site, values } from '../data/site.js';

export default function About() {
  usePageTitle('About us');

  return (
    <>
      <PageHero eyebrow="About us" title="A more responsive system of care, built in Zach’s name.">
        <p>
          The foundation is new. The mission is not a slogan we are waiting to define. It is the sentence the family is organizing around, and the vision that follows it.
        </p>
      </PageHero>

      <section className="container-page grid gap-6 py-16 lg:grid-cols-2">
        <article className="card p-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-evergreen-600">
            Mission
          </h2>
          <p className="mt-4 text-2xl font-medium leading-snug text-evergreen-950">{site.mission}</p>
        </article>
        <article className="card bg-evergreen-800 p-8 text-cream">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-evergreen-200">
            Vision
          </h2>
          <p className="mt-4 leading-relaxed text-white">{site.vision}</p>
        </article>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="How care should move" title="From a student, to a person, to a plan.">
            This is the path we want every campus partner to be able to walk. It is a design, not a claim that the rooms are open.
          </SectionHeading>
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
        <SectionHeading eyebrow="Values" title="Hover a card. The short version is on the front.">
          These are working values for a young organization. The board can revise them. They are not a brand exercise detached from the mission.
        </SectionHeading>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="group h-56 [perspective:1000px]">
              <div className="relative h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 flex flex-col justify-between rounded-3xl bg-evergreen-800 p-6 text-white [backface-visibility:hidden]">
                  <h3 className="font-display text-2xl font-semibold">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-evergreen-50">{value.front}</p>
                </div>
                <div className="absolute inset-0 rounded-3xl border border-evergreen-100 bg-white p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <h3 className="font-display text-lg font-semibold text-evergreen-900">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-evergreen-800">{value.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="People" title="The board is not named yet.">
          Seats are shown so the structure is visible. No names are invented here. Photos and biographies will replace these cards when the family is ready.
        </SectionHeading>
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
