/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CrisisContext = createContext(null);
const STORAGE_KEY = 'zwf-crisis-dismissed';

export function CrisisProvider({ children }) {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* private mode */
    }
    setVisible(false);
  }, []);

  const recall = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode */
    }
    setVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo(() => ({ visible, dismiss, recall }), [visible, dismiss, recall]);

  return <CrisisContext.Provider value={value}>{children}</CrisisContext.Provider>;
}

export function useCrisis() {
  const context = useContext(CrisisContext);
  if (!context) {
    throw new Error('useCrisis must be used within CrisisProvider');
  }
  return context;
}
