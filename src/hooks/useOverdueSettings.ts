import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OverdueRule = 'never' | 'daily' | 'weekly' | 'custom';

export const OVERDUE_RULE_KEY = 'vetapp_overdue_rule';
export const DEFAULT_OVERDUE_RULE: OverdueRule = 'daily';

export function useOverdueSettings(): {
  rule: OverdueRule;
  loaded: boolean;
} {
  const [rule, setRule] = useState<OverdueRule>(DEFAULT_OVERDUE_RULE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(OVERDUE_RULE_KEY).then(val => {
      if (val && ['never', 'daily', 'weekly', 'custom'].includes(val)) {
        setRule(val as OverdueRule);
      }
      setLoaded(true);
    });
  }, []);

  return { rule, loaded };
}
