import { site } from '../data/site.js';

export async function sendForm(payload) {
  let response;
  try {
    response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(`The note could not be sent. Email ${site.email} instead.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `The note could not be sent. Email ${site.email} instead.`);
  }
  return data;
}
