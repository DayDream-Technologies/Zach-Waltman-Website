export default function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-evergreen-900">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-evergreen-600">{hint}</p> : null}
      {error ? <p className="mt-1.5 text-sm text-red-800">{error}</p> : null}
    </div>
  );
}
