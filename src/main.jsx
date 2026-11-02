import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/outfit/latin-600.css';
import App from './App.jsx';
import { CrisisProvider } from './context/CrisisContext.jsx';
import './index.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')).render(
  <CrisisProvider>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </CrisisProvider>,
);
