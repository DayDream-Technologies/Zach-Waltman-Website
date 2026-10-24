import { Phone, X } from 'lucide-react';
import { useCrisis } from '../context/CrisisContext.jsx';

export default function CrisisBanner() {
  const { visible, dismiss } = useCrisis();

  if (!visible) return null;

  return (
    <div className="bg-evergreen-950 text-cream" role="region" aria-label="Crisis help">
      <div className="container-page flex items-start gap-3 py-3 sm:items-center">
        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-evergreen-200" aria-hidden="true" />
        <p className="flex-1 text-sm leading-relaxed text-evergreen-50">
          <span className="font-semibold text-white">Need help now?</span>{' '}
          Call or text <a className="underline decoration-evergreen-300 underline-offset-2" href="tel:988">988</a>
          {' '}(24/7), or text HOME to{' '}
          <a className="underline decoration-evergreen-300 underline-offset-2" href="sms:741741?body=HOME">741741</a>.
          {' '}If you are in immediate danger, call{' '}
          <a className="underline decoration-evergreen-300 underline-offset-2" href="tel:911">911</a>.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full p-1 text-evergreen-100 hover:bg-white/10"
          aria-label="Hide crisis banner for this visit"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
