import PageHero from '../components/PageHero.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { events } from '../data/events.js';

export default function Events() {
  usePageTitle('Events');

  return (
    <>
      <PageHero eyebrow="Events" title="We are working on planning events." />

      <section className="container-page py-16">
        <p className="max-w-3xl text-lg leading-relaxed text-evergreen-900">
          9:30 Mass at Saint Francis Xavier in Wilmette will be held in Zach’s name on the following dates:
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id} className="card px-5 py-4 text-evergreen-950">
              {event.label}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
