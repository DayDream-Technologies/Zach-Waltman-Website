import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

export default function NotFound() {
  usePageTitle('Page not found');

  return (
    <>
      <PageHero eyebrow="404" title="That page is not here.">
        <p>
          The link may be old, or the page may not be written yet. You can go back home, or get help now if that is what you were looking for.
        </p>
      </PageHero>
      <section className="container-page flex flex-wrap gap-3 py-12">
        <Link to="/" className="btn-primary">Back home</Link>
        <a href="tel:988" className="btn-secondary">Call or text 988</a>
        <Link to="/resources" className="btn-secondary">Resources</Link>
      </section>
    </>
  );
}
