import Reveal from './Reveal.jsx';

export default function SectionHeading({ eyebrow, title, children, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left';

  return (
    <Reveal className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-evergreen-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-evergreen-900 sm:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-base leading-relaxed text-evergreen-800">{children}</p> : null}
    </Reveal>
  );
}
