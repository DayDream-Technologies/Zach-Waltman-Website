import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, MapPin } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import PlaceholderNote from '../components/PlaceholderNote.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { eventCategories, events } from '../data/events.js';
import { downloadIcs } from '../lib/ics.js';

function useCountdown(iso) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function formatWhen(iso) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Chicago',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

export default function Events() {
  usePageTitle('Events');
  const [when, setWhen] = useState('upcoming');
  const [category, setCategory] = useState('all');

  const next = useMemo(() => {
    const now = Date.now();
    return events
      .filter((event) => new Date(event.start).getTime() > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))[0];
  }, []);

  const countdown = useCountdown(next ? next.start : new Date().toISOString());

  const visible = events
    .filter((event) => {
      const upcoming = new Date(event.start).getTime() >= Date.now();
      if (when === 'upcoming' && !upcoming) return false;
      if (when === 'past' && upcoming) return false;
      if (category !== 'all' && event.category !== category) return false;
      return true;
    })
    .sort((a, b) => {
      const delta = new Date(a.start) - new Date(b.start);
      return when === 'past' ? -delta : delta;
    });

  return (
    <>
      <PageHero eyebrow="Events" title="Gatherings will be listed here when they are real.">
        <p>
          The cards below are samples, so you can see how a date, a place, and a calendar file will look. None of these events is scheduled. Do not travel for them.
        </p>
      </PageHero>

      {next && countdown ? (
        <section className="container-page py-10">
          <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-evergreen-600">
                Next sample date
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold">{next.title}</h2>
              <p className="mt-2 text-sm text-evergreen-700">{formatWhen(next.start)} · {next.location}</p>
              <PlaceholderNote>Sample countdown, not a real event.</PlaceholderNote>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center" aria-label="Countdown">
              {[
                ['Days', countdown.days],
                ['Hours', countdown.hours],
                ['Min', countdown.minutes],
                ['Sec', countdown.seconds],
              ].map(([label, value]) => (
                <div key={label} className="min-w-16 rounded-2xl bg-evergreen-800 px-3 py-3 text-white">
                  <p className="font-display text-2xl font-semibold">{String(value).padStart(2, '0')}</p>
                  <p className="text-[10px] uppercase tracking-wider text-evergreen-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-page pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full bg-white p-1" role="group" aria-label="Time">
            {['upcoming', 'past'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setWhen(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                  when === value ? 'bg-evergreen-800 text-white' : 'text-evergreen-800'
                }`}
                aria-pressed={when === value}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
            {eventCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  category === item.id ? 'bg-evergreen-100 font-semibold text-evergreen-950' : 'text-evergreen-700 hover:bg-white'
                }`}
                aria-pressed={category === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {visible.map((event) => (
            <article key={event.id} className="card flex h-full flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-evergreen-600">
                {event.category} · sample
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-evergreen-700">{formatWhen(event.start)}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-evergreen-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {event.location}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-evergreen-800">{event.summary}</p>
              <button type="button" className="btn-secondary mt-5 self-start" onClick={() => downloadIcs(event)}>
                <CalendarPlus className="h-4 w-4" />
                Add to calendar
              </button>
            </article>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="mt-8 text-evergreen-800">No sample events in this view.</p>
        ) : null}
      </section>
    </>
  );
}
