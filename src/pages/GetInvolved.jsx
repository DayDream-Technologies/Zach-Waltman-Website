import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Share2 } from 'lucide-react';
import Field from '../components/Field.jsx';
import PageHero from '../components/PageHero.jsx';
import PlaceholderNote from '../components/PlaceholderNote.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { siteUrl } from '../lib/publicUrl.js';

const tabs = [
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'fundraiser', label: 'Host a fundraiser' },
  { id: 'campus', label: 'Bring us to campus' },
  { id: 'corporate', label: 'Corporate partners' },
  { id: 'share', label: 'Spread the word' },
];

const interests = ['Peer support', 'Events', 'Campus outreach', 'Design and writing', 'Behind the scenes'];

const emptyVolunteer = {
  name: '',
  email: '',
  phone: '',
  place: '',
  interests: [],
  message: '',
};

function validateVolunteer(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please add your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email.';
  if (values.place.trim().length < 2) errors.place = 'Add a city or campus.';
  if (!values.interests.length) errors.interests = 'Choose at least one way to help.';
  return errors;
}

export default function GetInvolved() {
  usePageTitle('Get involved');
  const [tab, setTab] = useState('volunteer');
  const [values, setValues] = useState(emptyVolunteer);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [newsletter, setNewsletter] = useState('');
  const [newsletterState, setNewsletterState] = useState('');
  const [copied, setCopied] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function toggleInterest(interest) {
    setValues((current) => {
      const has = current.interests.includes(interest);
      return {
        ...current,
        interests: has
          ? current.interests.filter((item) => item !== interest)
          : [...current.interests, interest],
      };
    });
  }

  function onVolunteer(event) {
    event.preventDefault();
    const next = validateVolunteer(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaved(true);
  }

  function onNewsletter(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter)) {
      setNewsletterState('error');
      return;
    }
    setNewsletterState('saved');
  }

  async function copyLink() {
    const url = siteUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const shareUrl = siteUrl();
  const shareText = 'The Zach Waltman Foundation is building immediate mental health support for students.';

  return (
    <>
      <PageHero eyebrow="Get involved" title="There is a role that is not “wait until we are bigger.”">
        <p>
          Volunteer, bring a conversation to a campus, or tell someone the mission. Forms on this page check what you type. They do not send it anywhere yet.
        </p>
      </PageHero>

      <section className="container-page py-12">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Ways to help">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                tab === item.id ? 'bg-evergreen-800 text-white' : 'bg-white text-evergreen-800'
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'volunteer' ? (
                <VolunteerPanel
                  values={values}
                  errors={errors}
                  saved={saved}
                  onChange={update}
                  onToggle={toggleInterest}
                  onSubmit={onVolunteer}
                  onReset={() => {
                    setSaved(false);
                    setValues(emptyVolunteer);
                    setErrors({});
                  }}
                />
              ) : null}
              {tab === 'fundraiser' ? (
                <InfoPanel
                  title="Host a fundraiser"
                  body="A skate, a 5K, a residence-hall dinner, a jersey auction. We do not have a host kit yet. When we do, it will cover how to talk about Zach, where the money goes, and how to hand people 988 as readily as a donation link."
                />
              ) : null}
              {tab === 'campus' ? (
                <InfoPanel
                  title="Bring the conversation to your campus"
                  body="Student governments, athletic departments, counseling centers, and fraternity and sorority chapters can ask for a visit or a resource drop. Partnerships are not signed yet. Use the volunteer form and choose Campus outreach so we have your note when the inbox is connected."
                />
              ) : null}
              {tab === 'corporate' ? (
                <InfoPanel
                  title="Corporate partners"
                  body="Matching gifts, sponsored trainings, and in-kind clinical or legal help will matter more than a logo on a banner. There is no partnership deck yet. A company that wants to talk should wait for a published email, or leave a note through the volunteer form in the meantime, knowing it is not delivered yet."
                />
              ) : null}
              {tab === 'share' ? (
                <div className="card p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold">Spread the word</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-evergreen-800">
                    Share the site, and share 988 in the same breath. The foundation does not have social accounts yet, so these buttons share this website, not a profile.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" className="btn-secondary" onClick={copyLink}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy site link'}
                    </button>
                    <a
                      className="btn-secondary"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    >
                      <Share2 className="h-4 w-4" />
                      Post
                    </a>
                    <a
                      className="btn-secondary"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    >
                      Facebook
                    </a>
                    {typeof navigator !== 'undefined' && navigator.share ? (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          navigator.share({ title: 'Zach Waltman Foundation', text: shareText, url: shareUrl }).catch(() => {});
                        }}
                      >
                        Share…
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold">Notes from the foundation</h2>
            <p className="mt-3 text-sm leading-relaxed text-evergreen-800">
              A short email when there is a real update: a program, a date, a board. There is no list yet, and this box does not subscribe you.
            </p>
            <PlaceholderNote>Connect to a newsletter tool.</PlaceholderNote>
          </div>
          {newsletterState === 'saved' ? (
            <p className="card p-6 text-sm text-evergreen-800" role="status">
              Email looks valid. It was not added to a list, because no list exists yet.
            </p>
          ) : (
            <form className="card space-y-4 p-6" onSubmit={onNewsletter} noValidate>
              <Field
                id="newsletter-email"
                label="Email"
                error={newsletterState === 'error' ? 'Enter a valid email.' : ''}
              >
                <input
                  id="newsletter-email"
                  type="email"
                  className={`field-input ${newsletterState === 'error' ? 'field-input-error' : ''}`}
                  value={newsletter}
                  onChange={(event) => {
                    setNewsletter(event.target.value);
                    setNewsletterState('');
                  }}
                  autoComplete="email"
                />
              </Field>
              <button type="submit" className="btn-primary">Check this address</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function InfoPanel({ title, body }) {
  return (
    <div className="card p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-evergreen-800">{body}</p>
      <PlaceholderNote>Program details still to be written.</PlaceholderNote>
    </div>
  );
}

function VolunteerPanel({ values, errors, saved, onChange, onToggle, onSubmit, onReset }) {
  if (saved) {
    return (
      <div className="card flex flex-col items-start gap-3 p-8" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen-800 text-white">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="font-display text-2xl font-semibold">Looks complete</h2>
        <p className="max-w-xl text-sm leading-relaxed text-evergreen-800">
          The form checked out. It was not sent. When an inbox is connected, this same note will reach the foundation. Until then, nothing was stored.
        </p>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <form className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8" onSubmit={onSubmit} noValidate>
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl font-semibold">Volunteer interest</h2>
        <p className="mt-2 text-sm text-evergreen-700">All fields except phone are required. This preview stays in your browser.</p>
        <PlaceholderNote>No backend yet.</PlaceholderNote>
      </div>
      <Field id="vol-name" label="Name" error={errors.name}>
        <input id="vol-name" name="name" className={`field-input ${errors.name ? 'field-input-error' : ''}`} value={values.name} onChange={onChange} autoComplete="name" />
      </Field>
      <Field id="vol-email" label="Email" error={errors.email}>
        <input id="vol-email" name="email" type="email" className={`field-input ${errors.email ? 'field-input-error' : ''}`} value={values.email} onChange={onChange} autoComplete="email" />
      </Field>
      <Field id="vol-phone" label="Phone (optional)">
        <input id="vol-phone" name="phone" className="field-input" value={values.phone} onChange={onChange} autoComplete="tel" />
      </Field>
      <Field id="vol-place" label="City or campus" error={errors.place}>
        <input id="vol-place" name="place" className={`field-input ${errors.place ? 'field-input-error' : ''}`} value={values.place} onChange={onChange} />
      </Field>
      <fieldset className="sm:col-span-2">
        <legend className="mb-2 text-sm font-medium text-evergreen-900">How you might help</legend>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => {
            const on = values.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => onToggle(interest)}
                className={`rounded-full px-3 py-1.5 text-sm ${on ? 'bg-evergreen-800 text-white' : 'bg-cream text-evergreen-800'}`}
                aria-pressed={on}
              >
                {interest}
              </button>
            );
          })}
        </div>
        {errors.interests ? <p className="mt-2 text-sm text-red-800">{errors.interests}</p> : null}
      </fieldset>
      <div className="sm:col-span-2">
        <Field id="vol-message" label="Anything you want us to know (optional)">
          <textarea id="vol-message" name="message" rows={4} className="field-input" value={values.message} onChange={onChange} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary">Check my note</button>
      </div>
    </form>
  );
}
