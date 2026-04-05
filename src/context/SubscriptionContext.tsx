import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  isPro: boolean;
  loading: boolean;
  togglePro: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  loading: true,
  togglePro: () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProStatus = useCallback(async () => {
    if (!user) {
      setIsPro(false);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // Profile may not exist yet — create it
      await supabase.from('profiles').upsert({
        id: user.id,
        is_premium: false,
      });
      setIsPro(false);
    } else {
      setIsPro(data.is_premium || false);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProStatus();
  }, [fetchProStatus]);

  const togglePro = async () => {
    if (!user) return;
    const newValue = !isPro;
    setIsPro(newValue);
    await supabase
      .from('profiles')
      .update({ is_premium: newValue })
      .eq('id', user.id);
  };

  return (
    <SubscriptionContext.Provider value={{ isPro, loading, togglePro }}>
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
