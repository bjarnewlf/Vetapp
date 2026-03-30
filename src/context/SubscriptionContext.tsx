import React, { createContext, useContext, useState } from 'react';

interface SubscriptionContextType {
  isPro: boolean;
  togglePro: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  togglePro: () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  return (
    <SubscriptionContext.Provider value={{ isPro, togglePro: () => setIsPro(p => !p) }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}

// Free tier limits
export const FREE_LIMITS = {
  maxPets: 1,
  allowedEventTypes: ['vaccination'] as const,
  documents: false,
  pdfExport: false,
  customEventTypes: false,
  recurrence: false,
};
