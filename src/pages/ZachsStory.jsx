import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Field from '../components/Field.jsx';
import PageHero from '../components/PageHero.jsx';
import PlaceholderNote from '../components/PlaceholderNote.jsx';
import Reveal from '../components/Reveal.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { storyTimeline } from '../data/faqs.js';

const emptyMemory = { name: '', email: '', memory: '', share: false };

const rememberedQuotes = [
  'He lit up every room he entered',
  'I wouldn’t be the person I am today without Zach',
  'One of the best people I have ever met in my life',
  'The guy who would chew me out for not going out',
  'He was the guy who would make me laugh even when I was trying my hardest not to',
  'He had an impact on me like no other',
  'He was my favorite neighborhood kid, always so polite and friendly',
  'Zach was always looking for a loophole',
  'A wonderful boy, kind, fun, hilarious, and a dear friend to my son',
  'He left joy with everyone he met',
  'I love how cheerful and passionate he was',
  'I’ll never meet anyone like Zach the rest of my life, I’m forever grateful he came into my life',
  'He was the most perfect person and one of my favorites I have ever met',
  'Zach embodies the person all parents wish for. He was funny, kind, outgoing, and knew how to make good out of every bad',
  'He was such a special person who brought so much light to the lives of others',
  'His presence made a difference, and the love and memories he leaves behind will stay with us always',
];

export default function ZachsStory() {
  usePageTitle("Zach's Story");
  const [memory, setMemory] = useState(emptyMemory);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setMemory((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    const next = {};
    if (memory.name.trim().length < 2) next.name = 'Please add your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memory.email)) next.email = 'Enter a valid email.';
    if (memory.memory.trim().length < 20) next.memory = 'A memory needs at least a sentence.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaved(true);
  }

  return (
    <>
      <PageHero eyebrow="Zach’s story" title="Remembered for the way he showed up.">
        <p>
          This page uses only what Zach’s family and the public record have already said. A longer story, in their words, still needs to be written. Nothing here describes the manner of his death.
        </p>
      </PageHero>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl">
          <ol className="relative border-l border-evergreen-200 pl-8">
            {storyTimeline.map((item, index) => (
              <Reveal key={item.title}>
                <li className="relative pb-12">
                  <span className="absolute -left-[2.4rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-evergreen-800 text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-evergreen-600">{item.year}</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold">{item.title}</h2>
                  <p className="mt-3 leading-relaxed text-evergreen-800">{item.text}</p>
                  {item.placeholder ? <PlaceholderNote>Waiting on the family</PlaceholderNote> : null}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">In the family’s words</h2>
            <figure className="mt-6 border-l-4 border-evergreen-800 pl-5">
              <blockquote className="text-lg leading-relaxed text-evergreen-950">
                Zach was a brother, a son, a passionate friend to so many, a student, an athlete, a hockey player, an avid sports fan, and someone who valued physical fitness.
              </blockquote>
              <figcaption className="mt-3 text-sm text-evergreen-700">
                The Waltman Family, on the public fundraiser for campus suicide prevention.
              </figcaption>
            </figure>
            <p className="mt-6 leading-relaxed text-evergreen-800">
              They wrote that they want to carry his spirit of teamwork, strength, and caring for others forward, by making mental-health and suicide-prevention resources available to college students 24 hours a day, 7 days a week.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold">Photographs</h2>
            <p className="mt-3 text-sm text-evergreen-700">
              No personal photos are published until the family provides them and says where they may appear.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {['On the ice', 'With friends', 'At home', 'At State', 'Game day', 'A favorite'].map((label) => (
                <div
                  key={label}
                  className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border border-dashed border-evergreen-300 bg-cream text-center"
                >
                  <span className="font-display text-3xl text-evergreen-300">84</span>
                  <span className="mt-2 px-3 text-xs text-evergreen-600">{label} · forthcoming</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container-page">
          <h3 className="mt-14 font-display text-2xl font-semibold">From people who knew him</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {rememberedQuotes.map((quote) => (
              <figure key={quote} className="card border-l-4 border-l-evergreen-800 p-5">
                <blockquote className="leading-relaxed text-evergreen-950">“{quote}”</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold">Share a memory</h2>
            <p className="mt-3 leading-relaxed text-evergreen-800">
              If you have any memories you would like to share with Zach’s family, submit here.
            </p>
            <PlaceholderNote>Needs a private inbox before it can send.</PlaceholderNote>
          </div>
          {saved ? (
            <div className="card flex flex-col items-start gap-3 p-8" role="status">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen-800 text-white">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="font-display text-2xl font-semibold">Held on this page only</h3>
              <p className="text-sm leading-relaxed text-evergreen-800">
                Thank you for writing it down. The foundation cannot receive it until this form is connected. Please keep a copy if you want the family to have it sooner.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSaved(false);
                  setMemory(emptyMemory);
                }}
              >
                Write another
              </button>
            </div>
          ) : (
            <form className="card space-y-4 p-6 sm:p-8" onSubmit={onSubmit} noValidate>
              <Field id="memory-name" label="Your name" error={errors.name}>
                <input id="memory-name" name="name" className={`field-input ${errors.name ? 'field-input-error' : ''}`} value={memory.name} onChange={update} autoComplete="name" />
              </Field>
              <Field id="memory-email" label="Email" error={errors.email} hint="So the family can reply, once the form is connected.">
                <input id="memory-email" name="email" type="email" className={`field-input ${errors.email ? 'field-input-error' : ''}`} value={memory.email} onChange={update} autoComplete="email" />
              </Field>
              <Field id="memory-body" label="A memory" error={errors.memory}>
                <textarea id="memory-body" name="memory" rows={5} className={`field-input ${errors.memory ? 'field-input-error' : ''}`} value={memory.memory} onChange={update} />
              </Field>
              <label className="flex items-start gap-3 text-sm text-evergreen-800">
                <input type="checkbox" name="share" checked={memory.share} onChange={update} className="field-check" />
                The family may share this on the site later, with my name. Leave this unchecked to keep it private.
              </label>
              <button type="submit" className="btn-primary">Save on this page</button>
            </form>
          )}
        </div>
        <p className="mt-10 text-sm text-evergreen-700">
          The work that follows his story lives on the{' '}
          <Link className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2" to="/about">about page</Link>
          {' '}and the{' '}
          <Link className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2" to="/donate">donate page</Link>.
        </p>
      </section>
    </>
  );
}
