import { Link } from 'react-router-dom';
import { navLinks, site } from '../data/site.js';
import { publicUrl } from '../lib/publicUrl.js';
import { useCrisis } from '../context/CrisisContext.jsx';

export default function Footer() {
  const { recall, visible } = useCrisis();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-evergreen-950 text-evergreen-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src={publicUrl('logo.png')}
            alt=""
            width={1024}
            height={1024}
            className="mb-4 h-24 w-auto rounded-2xl bg-cream p-2"
          />
          <p className="max-w-sm text-sm leading-relaxed text-evergreen-100/90">{site.mission}</p>
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Explore
          </h2>
          <ul className="mt-4 text-sm">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link className="flex min-h-11 items-center hover:text-white" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="flex min-h-11 items-center hover:text-white" to="/donate">
                Donate
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Help now
          </h2>
          <ul className="mt-4 text-sm">
            <li>
              <a className="flex min-h-11 items-center hover:text-white" href="tel:988">Call or text 988</a>
            </li>
            <li>
              <a className="flex min-h-11 items-center hover:text-white" href="https://988lifeline.org" target="_blank" rel="noreferrer">
                988lifeline.org
              </a>
            </li>
            {!visible ? (
              <li>
                <button type="button" className="flex min-h-11 items-center underline decoration-evergreen-400 underline-offset-2 hover:text-white" onClick={recall}>
                  Show the crisis banner
                </button>
              </li>
            ) : null}
          </ul>
          <p className="mt-6 text-sm">
            <a className="inline-block min-h-11 break-all py-3 leading-snug hover:text-white" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-evergreen-200/80">
            Social accounts are not set up yet.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 text-xs text-evergreen-200/80">
          © {year} {site.name}. In memory of Zachary Waltman.
          {' '}This site does not provide therapy or emergency care.
        </p>
      </div>
    </footer>
  );
}
