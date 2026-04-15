import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { getSupabaseEnv, isSupabaseConfigured } from '../config/env';

const env = getSupabaseEnv();

export const hasSupabaseEnv = isSupabaseConfigured();

export const supabase = hasSupabaseEnv
  ? createClient(env.url, env.anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
