import { useEffect, useRef } from 'react';
import PageHero from '../components/PageHero.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { site } from '../data/site.js';
import { publicUrl } from '../lib/publicUrl.js';

const ZEFFY_SCRIPT = 'https://www.zeffy.com/embed/v2/zeffy-embed.js';
const ZEFFY_FORM = 'https://www.zeffy.com/embed/donation-form/zach-waltman-mental-health-crisis-campus-suicide-prevention';

function showZeffyFallback(root) {
  root.querySelectorAll('[data-zeffy-embed-fallback]').forEach((el) => {
    el.style.display = 'block';
    el.querySelectorAll('iframe[data-zeffy-embed-src]').forEach((frame) => {
      frame.src = frame.getAttribute('data-zeffy-embed-src');
    });
  });
}

export default function Donate() {
  usePageTitle('Donate');
  const embedRef = useRef(null);

  useEffect(() => {
    const root = embedRef.current;
    if (!root) return undefined;
    const script = document.createElement('script');
    script.src = ZEFFY_SCRIPT;
    script.async = true;
    script.onerror = () => showZeffyFallback(root);
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <PageHero eyebrow="Donate" title="A gift toward care a student can reach tonight." />

      <section className="container-page py-12">
        <img
          src={publicUrl('Images/friends.jpg')}
          alt="Zach with a group of friends outside a house"
          width={1206}
          height={904}
          className="mb-8 aspect-[4/3] w-full rounded-3xl object-cover shadow-card"
        />
        <div ref={embedRef}>
          <div
            data-zeffy-embed
            data-form-url="/embed/donation-form/zach-waltman-mental-health-crisis-campus-suicide-prevention"
          />
          <div data-zeffy-embed-fallback style={{ display: 'none' }}>
            <div style={{ position: 'relative', overflow: 'hidden', height: 450, width: '100%' }}>
              <iframe
                title="Donation form powered by Zeffy"
                style={{ position: 'absolute', border: 0, top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}
                data-zeffy-embed-src={ZEFFY_FORM}
                allow="payment"
              />
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-evergreen-600">
          The foundation’s EIN is 42-5220430. Do not assume a gift is deductible until the foundation states that it is a 501(c)(3) on the acknowledgment. This is not tax advice.
        </p>
      </section>

      <section className="bg-white py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-display text-3xl font-semibold">Donor-advised funds and gifts of stock</h2>
          <p className="mt-3 text-sm leading-relaxed text-evergreen-800">
            A gift from a donor-advised fund, or a donation of stock, should not go through the form on this page. Those donors should email the family. They will share how to send the gift.
          </p>
          <p className="mt-4">
            <a
              className="break-all font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-4"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
