import { Link } from 'react-router-dom';
import { ArrowRight, Clock, HeartHandshake, Phone } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import SubscribeForm from '../components/SubscribeForm.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { events } from '../data/events.js';
import { pillars, site } from '../data/site.js';
import { publicUrl } from '../lib/publicUrl.js';

const pillarIcons = [Phone, HeartHandshake, Clock];

function nextSampleEvent() {
  const now = Date.now();
  return events
    .filter((event) => new Date(event.start).getTime() > now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))[0];
}

export default function Home() {
  usePageTitle('');
  const upcoming = nextSampleEvent();

  return (
    <>
      <section className="relative overflow-hidden">
        <p
          className="pointer-events-none absolute -left-6 top-8 select-none font-display text-[8rem] font-semibold leading-none text-evergreen-800/[0.06] sm:text-[14rem]"
          aria-hidden="true"
        >
          #84
        </p>
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.05] text-evergreen-950 sm:text-6xl">
              <span className="block">Immediate Support</span>
              <span className="block">Coordinated Care</span>
              <span className="block">A Safe Place</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-evergreen-800">
              {site.mission} {site.now}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/donate" className="btn-secondary">
                Donate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="card p-6 sm:p-8">
              <img
                src={publicUrl('logo.png')}
                alt="Zach Waltman Foundation"
                width={1024}
                height={1024}
                fetchPriority="high"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-20 pt-4">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index];
            return (
              <Reveal key={pillar.title} delay={index * 0.08}>
                <article className="card h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-evergreen-50 text-evergreen-800">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-semibold">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-evergreen-800">{pillar.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <Reveal>
            <div className="rounded-3xl bg-evergreen-800 p-8 text-cream shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-evergreen-200">Vision</p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white">{site.vision}</p>
              <Link to="/about" className="btn-light mt-8">
                About the foundation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <Reveal>
            <article className="card h-full p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-evergreen-600">Zach’s story</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">A brother, a son, a teammate, a friend.</h2>
              <p className="mt-4 leading-relaxed text-evergreen-800">
                Zach Waltman grew up in Wilmette, played hockey at Loyola Academy, and studied finance at Michigan State. Our family is building this foundation so another student has somewhere to turn.
              </p>
              <Link to="/zachs-story" className="btn-secondary mt-6">
                Read his story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="card h-full p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-evergreen-600">Events</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">
                {upcoming ? upcoming.title : 'Gatherings to come'}
              </h2>
              <p className="mt-4 leading-relaxed text-evergreen-800">
                {upcoming
                  ? upcoming.summary
                  : 'Real dates will be posted when our family schedules them.'}
              </p>
              <Link to="/events" className="btn-secondary mt-6">
                See our event calendar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="overflow-hidden rounded-[2rem] bg-evergreen-900 px-8 py-12 text-cream sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-evergreen-200">Give</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-white">
            Support the mission. Help build a place a student can go 24/7.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/donate" className="btn-light">
              Donate
            </Link>
            <Link to="/get-involved" className="btn border border-white/30 text-white hover:bg-white/10">
              Get involved
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <SubscribeForm id="home-updates" />
        </div>
      </section>
    </>
  );
}
