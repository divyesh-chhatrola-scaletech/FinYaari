import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import WaitlistModal from '../components/WaitlistModal';

const WaitlistModalContext = createContext(null);

export function WaitlistModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWaitlistModal = useCallback(() => setIsOpen(true), []);
  const closeWaitlistModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, openWaitlistModal, closeWaitlistModal }), [isOpen, openWaitlistModal, closeWaitlistModal]);

  return (
    <WaitlistModalContext.Provider value={value}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeWaitlistModal} />
    </WaitlistModalContext.Provider>
  );
}

export function useWaitlistModal() {
  const ctx = useContext(WaitlistModalContext);
  if (!ctx) throw new Error('useWaitlistModal must be used within a WaitlistModalProvider');
  return ctx;
}
