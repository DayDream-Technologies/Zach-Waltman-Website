const FORM_FROM = 'Zach Waltman Foundation <hello@zachwaltmanfoundation.org>';
const FORM_TO = 'ZachWaltmanFoundation@gmail.com';

const INTERESTS = ['Peer support', 'Events', 'Campus outreach', 'Design and writing', 'Behind the scenes'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function cleanBlock(value, max) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
    .slice(0, max);
}

function invalid(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

export function buildMessage(input) {
  const form = String(input?.form || '');
  const company = String(input?.company || '').trim();
  if (company) return { skip: true };

  const name = clean(input?.name, 120);
  const email = clean(input?.email, 200).toLowerCase();
  if (name.length < 2) throw invalid('Please add your name.');
  if (!EMAIL.test(email)) throw invalid('Enter a valid email.');

  if (form === 'volunteer') {
    const phone = clean(input?.phone, 40);
    const place = clean(input?.place, 160);
    const note = cleanBlock(input?.message, 4000);
    const interests = Array.isArray(input?.interests)
      ? INTERESTS.filter((item) => input.interests.includes(item))
      : [];
    if (place.length < 2) throw invalid('Add a city or campus.');
    if (!interests.length) throw invalid('Choose at least one way to help.');

    const lines = [
      'Someone sent a volunteer note from the website.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not given'}`,
      `City or campus: ${place}`,
      `How they might help: ${interests.join(', ')}`,
      `Asked for email updates: ${input?.updates ? 'Yes' : 'No'}`,
      '',
      'Note:',
      note || 'None',
    ];
    return {
      subject: `Volunteer note from ${name}`,
      text: lines.join('\n'),
      replyTo: email,
    };
  }

  if (form === 'memory') {
    const memory = cleanBlock(input?.memory, 8000);
    if (memory.length < 20) throw invalid('A memory needs at least a sentence.');
    const lines = [
      'Someone shared a memory of Zach on the website.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `May share on the site, with their name: ${input?.share ? 'Yes' : 'No'}`,
      '',
      'Memory:',
      memory,
    ];
    return {
      subject: `A memory of Zach from ${name}`,
      text: lines.join('\n'),
      replyTo: email,
    };
  }

  throw invalid('That form is not accepted.');
}

export async function deliverForm(input) {
  const message = buildMessage(input);
  if (message.skip) return { ok: true };

  const key = (process.env.RESEND_API_KEY || '').trim();
  if (!key) {
    const error = new Error('Mail is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.FORM_FROM || FORM_FROM,
      to: [process.env.FORM_TO || FORM_TO],
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const error = new Error('The note could not be sent.');
    error.statusCode = 502;
    throw error;
  }

  return { ok: true };
}
