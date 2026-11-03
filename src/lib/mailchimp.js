const LIST = 'https://zachwaltmanfoundation.us6.list-manage.com/subscribe/post-json';
const USER = 'ebbdd93b52d70b0ffaac99fb2';
const AUDIENCE = '8eb90b2c74';
const FORM = '002325e3f0';

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/^\d+\s*-\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function firstNameFrom(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 1 || parts.length === 2) return parts[0];
  return '';
}

export function interpretMailchimp(data) {
  const message = stripHtml(data?.msg);
  if (data?.result === 'success') {
    return /confirm/i.test(message)
      ? { status: 'confirm', message: 'Check your email to confirm.' }
      : { status: 'success', message: "You're on the list." };
  }
  if (/already subscribed/i.test(message)) {
    return { status: 'already', message: 'That address is already on the list.' };
  }
  return {
    status: 'error',
    message: message || 'The list did not accept that address. Try again in a moment.',
  };
}

export function subscribeEmail({ email, firstName = '', honeypot = '' }) {
  if (honeypot) {
    return Promise.resolve({ status: 'confirm', message: 'Check your email to confirm.' });
  }

  const callback = `mcCb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const params = new URLSearchParams({
    u: USER,
    id: AUDIENCE,
    f_id: FORM,
    EMAIL: email.trim(),
    c: callback,
  });
  if (firstName) params.set('FNAME', firstName);

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let settled = false;
    const timer = window.setTimeout(() => finish(() => reject(new Error('timeout'))), 12000);

    function cleanup() {
      window.clearTimeout(timer);
      delete window[callback];
      script.remove();
    }

    function finish(settle) {
      if (settled) return;
      settled = true;
      cleanup();
      settle();
    }

    window[callback] = (data) => {
      finish(() => resolve(interpretMailchimp(data)));
    };
    script.onerror = () => finish(() => reject(new Error('network')));
    script.src = `${LIST}?${params.toString()}`;
    document.head.appendChild(script);
  });
}
