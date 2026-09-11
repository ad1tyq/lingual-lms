import React, { createContext, useContext, useState, useEffect } from 'react';

interface ModalContextType {
  isPaywallOpen: boolean;
  paywallMessage: string;
  openPaywall: (message?: string) => void;
  closePaywall: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallMessage, setPaywallMessage] = useState('');

  const openPaywall = (message?: string) => {
    setPaywallMessage(
      message || 'This lecture is locked. Upgrade to PRO to unlock all language courses and video lessons!'
    );
    setIsPaywallOpen(true);
  };

  const closePaywall = () => {
    setIsPaywallOpen(false);
    setPaywallMessage('');
  };

  useEffect(() => {
    const handleSubscriptionRequired = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      openPaywall(customEvent.detail?.message);
    };

    window.addEventListener('auth:subscription-required', handleSubscriptionRequired);

    return () => {
      window.removeEventListener('auth:subscription-required', handleSubscriptionRequired);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ isPaywallOpen, paywallMessage, openPaywall, closePaywall }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
