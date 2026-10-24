export default function PageHero({ eyebrow, title, children }) {
  return (
    <section className="relative overflow-hidden border-b border-evergreen-100 bg-white">
      <p
        className="pointer-events-none absolute -right-4 top-6 select-none font-display text-[7rem] font-semibold leading-none text-evergreen-50 sm:text-[10rem]"
        aria-hidden="true"
      >
        84
      </p>
      <div className="container-page relative py-16 sm:py-20">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-evergreen-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl font-display text-4xl font-semibold text-evergreen-950 sm:text-5xl">
          {title}
        </h1>
        {children ? (
          <div className="mt-5 max-w-2xl text-lg leading-relaxed text-evergreen-800">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
