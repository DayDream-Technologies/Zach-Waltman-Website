/** Public-folder URL, including the GitHub Pages project path when the build sets one. */
export function publicUrl(path = '') {
  const base = import.meta.env.BASE_URL || '/';
  const raw = String(path);
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) return raw;

  const hashAt = raw.indexOf('#');
  const hash = hashAt >= 0 ? raw.slice(hashAt) : '';
  const beforeHash = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
  const queryAt = beforeHash.indexOf('?');
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : '';
  const pathname = (queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash).replace(/^\//, '');

  return `${base}${pathname}${query}${hash}`;
}

/** Absolute URL of the site root, including the Pages project path. */
export function siteUrl() {
  const base = import.meta.env.BASE_URL || '/';
  if (typeof window === 'undefined') return base;
  return new URL(base, window.location.origin).href;
}
