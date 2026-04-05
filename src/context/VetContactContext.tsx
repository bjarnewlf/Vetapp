import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { VetContact } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface VetContactContextType {
  vetContact: VetContact | null;
  loading: boolean;
  error: string | null;
  saveVetContact: (data: Omit<VetContact, 'id'>) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const VetContactContext = createContext<VetContactContextType>({} as VetContactContextType);

export function VetContactProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [vetContact, setVetContact] = useState<VetContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setVetContact(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase.from('vet_contacts').select('*').limit(1);
      if (fetchError) throw fetchError;
      if (data && data.length > 0) {
        const v = data[0];
        setVetContact({
          id: v.id,
          name: v.name,
          clinic: v.clinic || '',
          phone: v.phone || '',
          email: v.email || '',
          address: v.address || '',
        });
      } else {
        setVetContact(null);
      }
    } catch (e: any) {
      const message = e?.message || 'Tierarzt-Kontakt konnte nicht geladen werden.';
      console.error('Tierarzt-Kontakt konnte nicht geladen werden:', e);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveVetContact = async (data: Omit<VetContact, 'id'>): Promise<boolean> => {
    if (!user) return false;
    if (vetContact) {
      const { error } = await supabase.from('vet_contacts').update({
        name: data.name,
        clinic: data.clinic || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
      }).eq('id', vetContact.id);
      if (error) { setError(error.message); return false; }
    } else {
      const { error } = await supabase.from('vet_contacts').insert({
        user_id: user.id,
        name: data.name,
        clinic: data.clinic || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
      });
      if (error) { setError(error.message); return false; }
    }
    await refresh();
    return true;
  };

  return (
    <VetContactContext.Provider value={{ vetContact, loading, error, saveVetContact, refresh }}>
      {children}
    </VetContactContext.Provider>
  );
}

export function useVetContact() {
  return useContext(VetContactContext);
}
