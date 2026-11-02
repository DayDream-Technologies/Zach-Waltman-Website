import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CrisisBanner from './components/CrisisBanner.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import PageTransition from './components/PageTransition.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const Donate = lazy(() => import('./pages/Donate.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const GetInvolved = lazy(() => import('./pages/GetInvolved.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Resources = lazy(() => import('./pages/Resources.jsx'));
const ZachsStory = lazy(() => import('./pages/ZachsStory.jsx'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <main id="main" tabIndex={-1} className="flex-1 outline-none">
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Suspense fallback={<div className="min-h-[50vh]" aria-hidden="true" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/zachs-story" element={<ZachsStory />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <CrisisBanner />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </div>
  );
}
