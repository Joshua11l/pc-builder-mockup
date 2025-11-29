/**
 * Supabase Client Configuration
 * Initialize Supabase connection for PC Builder
 */

import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://wzncnntgnplptqzijjog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bmNubnRnbnBscHRxemlqam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDAyNzQsImV4cCI6MjA3OTk3NjI3NH0.hOr5FpDq6G6Xp1YVEwsrBXI51jYB0-vcI1L8oCcXibg';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Helper function to get current user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
