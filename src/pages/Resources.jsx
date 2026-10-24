import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Search, Wind } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Accordion from '../components/Accordion.jsx';
import CognitionDailySearch from '../components/CognitionDailySearch.jsx';
import PageHero from '../components/PageHero.jsx';
import PlaceholderNote from '../components/PlaceholderNote.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { audiences, helpAFriend, library, resourceTypes } from '../data/resources.js';
import { crisisLines } from '../data/site.js';
import { publicUrl } from '../lib/publicUrl.js';

const phases = [
  { label: 'Breathe in', seconds: 4, scale: 1.28 },
  { label: 'Hold', seconds: 4, scale: 1.28 },
  { label: 'Breathe out', seconds: 4, scale: 1 },
  { label: 'Hold', seconds: 4, scale: 1 },
];

function BreathingWidget() {
  const reduce = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [count, setCount] = useState(phases[0].seconds);
  const phaseRef = useRef(0);
  const phase = phases[phaseIndex];

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setCount((current) => {
        if (current > 1) return current - 1;
        phaseRef.current = (phaseRef.current + 1) % phases.length;
        const next = phaseRef.current;
        setPhaseIndex(next);
        return phases[next].seconds;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    if (running) {
      setRunning(false);
      phaseRef.current = 0;
      setPhaseIndex(0);
      setCount(phases[0].seconds);
      return;
    }
    setRunning(true);
  }

  return (
    <div className="card flex flex-col items-center p-8 text-center">
      <Wind className="h-5 w-5 text-evergreen-700" aria-hidden="true" />
      <h2 className="mt-3 font-display text-2xl font-semibold">A minute of breathing</h2>
      <p className="mt-2 max-w-md text-sm text-evergreen-700">
        This is a calming exercise, not a crisis service. If you need help now, call or text 988.
      </p>
      <motion.div
        className="my-8 flex h-36 w-36 items-center justify-center rounded-3xl bg-evergreen-800 text-white"
        animate={{ scale: running && !reduce ? phase.scale : 1 }}
        transition={{ duration: reduce ? 0 : phase.seconds * 0.9, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <span className="font-display text-4xl">{running ? count : '4'}</span>
      </motion.div>
      <p className="min-h-6 font-medium text-evergreen-900" aria-live="polite">
        {running ? `${phase.label} · ${count}` : 'Box breathing: four counts in, hold, out, hold.'}
      </p>
      <button type="button" className="btn-primary mt-5" onClick={toggle}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

export default function Resources() {
  usePageTitle('Resources');
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState('all');
  const [type, setType] = useState('all');

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return library.filter((item) => {
      if (audience !== 'all' && item.audience !== audience) return false;
      if (type !== 'all' && item.type !== type) return false;
      if (!needle) return true;
      return `${item.title} ${item.summary}`.toLowerCase().includes(needle);
    });
  }, [query, audience, type]);

  return (
    <>
      <PageHero eyebrow="Resources" title="Help that is open, and help we are still writing.">
        <p>
          If you need someone now, start with the lines below. The library under them mixes national organizations with draft guides. Drafts are marked, and a clinician still needs to review them.
        </p>
      </PageHero>

      <section className="container-page py-12" aria-labelledby="now-heading">
        <h2 id="now-heading" className="font-display text-3xl font-semibold">If you need help now</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {crisisLines.map((line) => (
            <article key={line.id} className="card p-6">
              <h3 className="font-display text-xl font-semibold">{line.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-evergreen-800">{line.detail}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a className="btn-primary" href={line.href}>{line.action}</a>
                {line.extraHref ? (
                  <a className="btn-secondary" href={line.extraHref} target="_blank" rel="noreferrer">
                    {line.extraLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page">
          <CognitionDailySearch />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold">Resource library</h2>
              <p className="mt-2 max-w-xl text-sm text-evergreen-700">
                Search by word, or filter by who it is for. Campus-specific numbers will be added as partnerships are real.
              </p>
              <PlaceholderNote>Clinical review of every draft guide.</PlaceholderNote>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <label className="relative block">
              <span className="sr-only">Search resources</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-evergreen-500" />
              <input
                className="field-input pl-11"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search resources"
              />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Audience">
              {audiences.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAudience(item.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    audience === item.id ? 'bg-evergreen-800 text-white' : 'bg-cream text-evergreen-800 hover:bg-evergreen-50'
                  }`}
                  aria-pressed={audience === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Type">
              {resourceTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    type === item.id ? 'bg-evergreen-100 text-evergreen-950' : 'text-evergreen-700 hover:bg-evergreen-50'
                  }`}
                  aria-pressed={type === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-evergreen-600" aria-live="polite">
            {results.length} {results.length === 1 ? 'resource' : 'resources'}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {results.map((item) => (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-3xl border border-evergreen-100 bg-cream p-5"
                >
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-evergreen-600">
                    <span>{item.audience}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.type}</span>
                    {item.draft ? <span className="text-evergreen-800">· Draft</span> : null}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-evergreen-800">{item.summary}</p>
                  {item.href ? (
                    <a
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2"
                      href={publicUrl(item.href)}
                      {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      Open
                      {item.href.startsWith('http') ? <ExternalLink className="h-3.5 w-3.5" /> : null}
                    </a>
                  ) : null}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          {results.length === 0 ? (
            <p className="mt-6 text-evergreen-800">Nothing matches that filter. Try a broader word, or clear the audience.</p>
          ) : null}
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 lg:grid-cols-2">
        <BreathingWidget />
        <div id="help-a-friend">
          <h2 className="font-display text-3xl font-semibold">How to help a friend</h2>
          <p className="mt-3 text-sm leading-relaxed text-evergreen-700">
            A draft for students. It is general guidance, not a clinical protocol, and it should be reviewed before the foundation treats it as final.
          </p>
          <div className="mt-5">
            <Accordion items={helpAFriend} />
          </div>
        </div>
      </section>
    </>
  );
}
