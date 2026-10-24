export default function PlaceholderNote({ children }) {
  if (!import.meta.env.DEV) return null;

  return (
    <span className="mt-3 inline-flex max-w-full items-center rounded-full border border-dashed border-evergreen-400 bg-evergreen-50 px-3 py-1 text-xs font-medium text-evergreen-800">
      Placeholder{children ? `: ${children}` : ''}
    </span>
  );
}
