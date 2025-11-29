/**
 * Authentication Service
 * Handles user registration, login, logout, and password reset
 */

import { supabase } from '../lib/supabase';

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User full name
 * @returns {Promise} User data or error
 */
export const registerUser = async (email, password, name) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    // Log activity
    if (data.user) {
      await logActivity(data.user.id, 'user_registered', { email });
    }

    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Session data or error
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Log activity
    if (data.user) {
      await logActivity(data.user.id, 'user_login', { email });
    }

    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout current user
 * @returns {Promise} Success or error
 */
export const logoutUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    // Log activity
    if (user) {
      await logActivity(user.id, 'user_logout', {});
    }

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise} Success or error
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return { success: true, message: 'Password reset email sent!' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user password (after reset)
 * @param {string} newPassword - New password
 * @returns {Promise} Success or error
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true, message: 'Password updated successfully!' };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current user
 * @returns {Promise} User object or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

/**
 * Check authentication status
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function for auth changes
 * @returns {Object} Subscription object
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

/**
 * Log user activity
 * @param {string} userId - User ID
 * @param {string} action - Action performed
 * @param {Object} details - Additional details
 */
const logActivity = async (userId, action, details) => {
  try {
    await supabase.from('activity_log').insert({
      user_id: userId,
      action,
      details,
    });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};
