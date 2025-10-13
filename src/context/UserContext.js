import React, { createContext, useContext, useState, useEffect } from 'react'

// Create the user context
const UserContext = createContext()

/**
 * Custom hook to access user context
 * Throws error if used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

/**
 * UserProvider Component (FR2, FR3, FR18, FR19)
 * Manages user authentication and activity logging throughout the app
 * - User authentication state management
 * - Login/logout functionality with session persistence
 * - Comprehensive activity logging for security and analytics
 * - Local storage integration for offline functionality
 */
export const UserProvider = ({ children }) => {
  // User state management
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
      logActivity('session_restored', { userId: JSON.parse(savedUser).id })
    }
  }, [])

  /**
   * Login Function - Authenticates user and starts session
   * @param {Object} userData - User data object containing id, name, email
   */
  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    logActivity('user_login', { userId: userData.id, email: userData.email })
  }

  /**
   * Logout Function - Securely ends user session and clears data
   * Satisfies FR18: Provide secure logout functionality
   */
  const logout = () => {
    if (user) {
      logActivity('user_logout', { userId: user.id })
    }
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
    
    // Clear sensitive data for security
    localStorage.removeItem('userPreferences')
    sessionStorage.clear()
  }

  /**
   * Activity Logging Function
   * Satisfies FR19: Log user activity for security and analytics
   * Records user actions with timestamps, context, and metadata
   * 
   * @param {string} action - Type of action performed (login, build_generation, etc.)
   * @param {Object} data - Additional context data for the action
   */
  const logActivity = (action, data = {}) => {
    const activityLog = JSON.parse(localStorage.getItem('userActivityLog') || '[]')
    const logEntry = {
      id: Date.now() + Math.random(),           // Unique identifier
      timestamp: new Date().toISOString(),      // ISO timestamp
      action,                                   // Action type
      userId: user?.id || 'anonymous',          // User ID or anonymous
      data,                                     // Additional context data
      userAgent: navigator.userAgent,           // Browser/device info
      url: window.location.pathname             // Current page
    }
    
    activityLog.push(logEntry)
    
    // Keep only last 1000 entries for storage efficiency
    if (activityLog.length > 1000) {
      activityLog.splice(0, activityLog.length - 1000)
    }
    
    localStorage.setItem('userActivityLog', JSON.stringify(activityLog))
    console.log('Activity logged:', logEntry) // For development monitoring
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    logActivity
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}