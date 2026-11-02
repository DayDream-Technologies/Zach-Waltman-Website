import PageHero from '../components/PageHero.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

export default function GetInvolved() {
  usePageTitle('Get involved');

  return <PageHero eyebrow="Get involved" title="How to get involved now." />;
}
