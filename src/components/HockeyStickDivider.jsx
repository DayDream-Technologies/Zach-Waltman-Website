import { motion, useReducedMotion } from 'framer-motion';

export function HockeyStick({ className = '', animate = false }) {
  const reduce = useReducedMotion();
  const draw = animate && !reduce;

  return (
    <svg viewBox="0 0 70 230" className={className} fill="none" aria-hidden="true">
      <motion.path
        d="M44 8 C46 78 42 118 34 150 C24 180 16 196 16 206"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: 'easeInOut' }}
      />
      <motion.path
        d="M16 206 C12 218 26 226 46 216 C54 211 55 204 50 200"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: draw ? 0.9 : 0, ease: 'easeOut' }}
      />
      <motion.path
        d="M22 208 H40 M24 213 H36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
        initial={draw ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: draw ? 1.3 : 0 }}
      />
    </svg>
  );
}

export default function HockeyStickDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 text-evergreen-700/35 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <svg viewBox="0 0 140 28" className="h-6 w-24" fill="none">
        <path d="M2 10 H86 C104 10 114 14 128 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 22 C134 26 122 27 114 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}
