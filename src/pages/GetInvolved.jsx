import { useState } from 'react';
import { Check } from 'lucide-react';
import Field from '../components/Field.jsx';
import PageHero from '../components/PageHero.jsx';
import SubscribeForm from '../components/SubscribeForm.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { firstNameFrom, subscribeEmail } from '../lib/mailchimp.js';
import { sendForm } from '../lib/sendForm.js';

const interests = ['Peer support', 'Events', 'Campus outreach', 'Design and writing', 'Behind the scenes'];

const emptyVolunteer = {
  name: '',
  email: '',
  phone: '',
  place: '',
  interests: [],
  message: '',
  updates: false,
  company: '',
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
  const [values, setValues] = useState(emptyVolunteer);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [listNote, setListNote] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function toggleInterest(interest) {
    setValues((current) => {
      const has = current.interests.includes(interest);
      return {
        ...current,
        interests: has ? current.interests.filter((item) => item !== interest) : [...current.interests, interest],
      };
    });
  }

  async function onVolunteer(event) {
    event.preventDefault();
    const next = validateVolunteer(values);
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await sendForm({
        form: 'volunteer',
        name: values.name,
        email: values.email,
        phone: values.phone,
        place: values.place,
        interests: values.interests,
        message: values.message,
        updates: values.updates,
        company: values.company,
      });
    } catch (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }

    let note = '';
    if (values.updates) {
      try {
        const result = await subscribeEmail({
          email: values.email,
          firstName: firstNameFrom(values.name),
          honeypot: values.company,
        });
        note = result.message;
      } catch {
        note = 'The email list did not respond. You can try the updates form below.';
      }
    }
    setListNote(note);
    setSaved(true);
    setSubmitting(false);
  }

  return (
    <>
      <PageHero eyebrow="Get involved" title="How to get involved now.">
        <p>
          Tell us how you want to help. Your note is emailed to the foundation. Email updates go out only if you ask for them.
        </p>
      </PageHero>

      <section className="container-page py-12">
        <VolunteerPanel
          values={values}
          errors={errors}
          saved={saved}
          listNote={listNote}
          submitting={submitting}
          onChange={update}
          onToggle={toggleInterest}
          submitError={submitError}
          onSubmit={onVolunteer}
          onReset={() => {
            setSaved(false);
            setListNote('');
            setSubmitError('');
            setValues(emptyVolunteer);
            setErrors({});
          }}
        />
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <SubscribeForm id="involved-updates" />
        </div>
      </section>
    </>
  );
}

function VolunteerPanel({ values, errors, saved, listNote, submitError, submitting, onChange, onToggle, onSubmit, onReset }) {
  if (saved) {
    return (
      <div className="card flex flex-col items-start gap-3 p-8" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen-800 text-white">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="font-display text-2xl font-semibold">Sent to the foundation</h2>
        <p className="max-w-xl text-sm leading-relaxed text-evergreen-800">
          Your note was emailed to the foundation. It may take a little while to hear back.
        </p>
        {listNote ? <p className="max-w-xl text-sm leading-relaxed text-evergreen-800">{listNote}</p> : null}
        <button type="button" className="btn-secondary" onClick={onReset}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <form className="card relative grid gap-4 p-6 sm:grid-cols-2 sm:p-8" onSubmit={onSubmit} noValidate>
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl font-semibold">Volunteer interest</h2>
        <p className="mt-2 text-sm text-evergreen-700">
          All fields except phone and the note are required. This is emailed to the foundation.
        </p>
      </div>
      <div className="absolute left-[-5000px]" aria-hidden="true">
        <label htmlFor="vol-company">Company</label>
        <input
          id="vol-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={onChange}
        />
      </div>
      <Field id="vol-name" label="Name" error={errors.name}>
        <input
          id="vol-name"
          name="name"
          className={`field-input ${errors.name ? 'field-input-error' : ''}`}
          value={values.name}
          onChange={onChange}
          autoComplete="name"
        />
      </Field>
      <Field id="vol-email" label="Email" error={errors.email}>
        <input
          id="vol-email"
          name="email"
          type="email"
          className={`field-input ${errors.email ? 'field-input-error' : ''}`}
          value={values.email}
          onChange={onChange}
          autoComplete="email"
        />
      </Field>
      <Field id="vol-phone" label="Phone (optional)">
        <input id="vol-phone" name="phone" className="field-input" value={values.phone} onChange={onChange} autoComplete="tel" />
      </Field>
      <Field id="vol-place" label="City or campus" error={errors.place}>
        <input
          id="vol-place"
          name="place"
          className={`field-input ${errors.place ? 'field-input-error' : ''}`}
          value={values.place}
          onChange={onChange}
        />
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
                className={`chip ${on ? 'bg-evergreen-800 text-white' : 'bg-cream text-evergreen-800'}`}
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
      <label className="flex items-start gap-3 text-sm text-evergreen-800 sm:col-span-2">
        <input type="checkbox" name="updates" checked={values.updates} onChange={onChange} className="field-check" />
        <span>
          Also send me email updates.
          <span className="mt-1 block text-xs text-evergreen-600">
            We’ll email a confirmation for the list. Your volunteer note is emailed separately.
          </span>
        </span>
      </label>
      <div className="sm:col-span-2">
        {submitError ? <p className="text-sm text-red-800 sm:col-span-2" role="alert">{submitError}</p> : null}
        <button type="submit" className="btn-primary disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send my note'}
        </button>
      </div>
    </form>
  );
}
