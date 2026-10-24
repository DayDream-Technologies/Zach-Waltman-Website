import { useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  cognitionCategories,
  cognitionJurisdictions,
  cognitionDailyResourcesUrl,
  countiesForState,
} from '../data/cognitionDaily.js';

export default function CognitionDailySearch() {
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [category, setCategory] = useState('psychology');
  const [counties, setCounties] = useState([]);
  const [countyStatus, setCountyStatus] = useState('idle');
  const [error, setError] = useState('');

  const zipDigits = zip.replace(/\D/g, '').slice(0, 5);
  const usingZip = zipDigits.length === 5;

  useEffect(() => {
    if (!state || usingZip) {
      setCounties([]);
      setCountyStatus('idle');
      return undefined;
    }
    let cancelled = false;
    setCountyStatus('loading');
    countiesForState(state)
      .then((list) => {
        if (cancelled) return;
        setCounties(list);
        setCountyStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setCounties([]);
        setCountyStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [state, usingZip]);

  const url = useMemo(() => {
    if (!usingZip && !state) return '';
    if (zip && zipDigits.length !== 5) return '';
    return cognitionDailyResourcesUrl({
      zip: usingZip ? zipDigits : '',
      state: usingZip ? '' : state,
      county: usingZip ? '' : county,
      category,
    });
  }, [usingZip, zip, zipDigits, state, county, category]);

  function onSubmit(event) {
    event.preventDefault();
    if (zip && zipDigits.length !== 5) {
      setError('A ZIP code needs 5 digits, or clear it and choose a state.');
      return;
    }
    if (!url) {
      setError('Enter a ZIP code or choose a state.');
      return;
    }
    setError('');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <form className="card mb-10 p-6 sm:p-8" onSubmit={onSubmit}>
      <h2 className="font-display text-3xl font-semibold">Find local care on Cognition Daily</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-evergreen-700">
        Enter a ZIP code or a state, and the kind of help you want. Search opens Cognition Daily in a new tab with that place and category already selected. This is a directory, not a crisis line. If you need someone now, call or text 988.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_1fr]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-evergreen-900">ZIP code</span>
          <input
            className="field-input"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 60091"
            value={zip}
            onChange={(event) => {
              setZip(event.target.value.replace(/\D/g, '').slice(0, 5));
              setError('');
            }}
            aria-describedby="cd-search-hint"
          />
        </label>
        <span className="self-end pb-3 text-sm text-evergreen-600 md:text-center">or</span>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-evergreen-900">State</span>
          <select
            className="field-input"
            value={state}
            onChange={(event) => {
              const next = event.target.value;
              setState(next);
              setCounty('');
              setCountyStatus(next ? 'loading' : 'idle');
              setError('');
            }}
          >
            <option value="">Select a state</option>
            {cognitionJurisdictions.map((item) => (
              <option key={item.code} value={item.code}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-evergreen-900">Kind of help</span>
          <select
            className="field-input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {cognitionCategories.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>
      {state && !usingZip ? (
        <label className="mt-4 block max-w-sm">
          <span className="mb-1.5 block text-sm font-medium text-evergreen-900">County</span>
          <select
            className="field-input"
            value={county}
            onChange={(event) => setCounty(event.target.value)}
            disabled={countyStatus !== 'ready'}
          >
            <option value="">
              {countyStatus === 'loading' ? 'Loading counties…' : 'All counties in this state'}
            </option>
            {counties.map((item) => (
              <option key={item.fips} value={item.fips}>{item.name}</option>
            ))}
          </select>
        </label>
      ) : null}
      <p id="cd-search-hint" className="mt-3 text-xs text-evergreen-600">
        {usingZip && state
          ? 'A complete ZIP code is what gets sent. The state is ignored, which is how Cognition Daily treats that combination.'
          : 'A ZIP code searches near that code. A state can be narrowed to one county.'}
      </p>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      {countyStatus === 'error' ? (
        <p className="mt-3 text-sm text-evergreen-700">County names did not load. You can still search the whole state.</p>
      ) : null}
      <button type="submit" className="btn-primary mt-5">
        Search on Cognition Daily
        <ExternalLink className="h-4 w-4" />
      </button>
    </form>
  );
}
