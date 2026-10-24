import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
