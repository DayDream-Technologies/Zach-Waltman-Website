import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../data/site.js';
import { publicUrl } from '../lib/publicUrl.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-evergreen-50 text-evergreen-900' : 'text-evergreen-800 hover:bg-evergreen-50'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-evergreen-100 bg-cream/95 shadow-sm backdrop-blur'
          : 'border-transparent bg-cream'
      }`}
    >
      <div className={`container-page flex items-center justify-between gap-4 transition-all ${scrolled ? 'py-2' : 'py-3'}`}>
        <Link to="/" className="flex items-center gap-3" aria-label="Zach Waltman Foundation home">
          <img
            src={publicUrl('logo(simple).PNG')}
            alt=""
            width={1024}
            height={1024}
            className={`w-auto object-contain transition-all ${scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/donate" className="btn-primary ml-2 px-4 py-2">
            Donate
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/donate" className="btn-primary min-h-11 px-4 py-2">
            Donate
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-evergreen-900 hover:bg-evergreen-50"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-evergreen-100 bg-cream lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {[...navLinks, { to: '/donate', label: 'Donate' }].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-full px-3 text-base font-medium ${
                      isActive ? 'bg-evergreen-50 text-evergreen-900' : 'text-evergreen-800 hover:bg-evergreen-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
