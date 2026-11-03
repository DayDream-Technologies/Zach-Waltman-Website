import { useState } from 'react';
import Field from './Field.jsx';
import { subscribeEmail } from '../lib/mailchimp.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeForm({ id = 'email-updates' }) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setError('Enter a valid email.');
      setStatus('');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await subscribeEmail({ email, honeypot });
      setStatus(result.status);
      setMessage(result.message);
      if (result.status === 'confirm' || result.status === 'success' || result.status === 'already') {
        setEmail('');
      }
    } catch {
      setStatus('error');
      setMessage('The list did not respond. Try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  }

  const done = status === 'confirm' || status === 'success' || status === 'already';

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 className="font-display text-3xl font-semibold">Email updates</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-evergreen-800">
          A short email when the foundation has a program, a date, or news to share.
        </p>
      </div>
      {done ? (
        <p className="card p-6 text-sm leading-relaxed text-evergreen-800" role="status">
          {message}
        </p>
      ) : (
        <form className="card relative space-y-4 p-6" onSubmit={onSubmit} noValidate>
          <div className="absolute left-[-5000px]" aria-hidden="true">
            <label htmlFor={`${id}-company`}>Company</label>
            <input
              id={`${id}-company`}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>
          <Field id={id} label="Email" error={error}>
            <input
              id={id}
              type="email"
              className={`field-input ${error ? 'field-input-error' : ''}`}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
                setStatus('');
              }}
              autoComplete="email"
              required
            />
          </Field>
          {status === 'error' ? (
            <p className="text-sm text-red-800" role="alert">
              {message}
            </p>
          ) : null}
          <button type="submit" className="btn-primary disabled:opacity-60" disabled={submitting}>
            {submitting ? 'Sending…' : 'Get email updates'}
          </button>
        </form>
      )}
    </div>
  );
}
