import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aapafgnvztpwjchgnrtt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGFmZ252enRwd2pjaGducnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDMyNzIsImV4cCI6MjA5MDUxOTI3Mn0.FPSjGEFeex6uM4p3uexVOKnz3CHoBfoNThs2FlZkSHM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
