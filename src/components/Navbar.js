import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaHome, FaTools, FaSave, FaUserPlus, FaQuestionCircle, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { useUser } from '../context/UserContext'
import logo from '../assets/pc-logo.png'

/**
 * Navbar Component (FR1, FR17, FR18)
 * Main navigation interface with responsive design, user authentication status display,
 * and dynamic login/logout functionality with sticky positioning
 */
export default function Navbar() {
  // Access user context for authentication state
  const { user, isAuthenticated, logout } = useUser()
  const navigate = useNavigate()
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /**
   * Handle user logout - clears session and redirects to home
   * Satisfies FR18: Secure logout functionality
   */
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  /**
   * Close mobile menu when clicking on a navigation link
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  
  return (
    // Main Navigation Bar with Sticky Positioning and Mobile Responsiveness
    <nav className="sticky top-0 bg-card-bg shadow-lg shadow-accent/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <img src={logo} alt="PC Builder Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg sm:text-xl font-bold text-accent hidden xs:block">PC Build Generator</span>
              <span className="text-lg font-bold text-accent xs:hidden">PC Builder</span>
            </div>
          </div>

          {/* Desktop Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaHome className="inline mr-1" /> Home
            </NavLink>
            <NavLink 
              to="/build" 
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaTools className="inline mr-1" /> Build
            </NavLink>
            <NavLink 
              to="/saved" 
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaSave className="inline mr-1" /> Saved
            </NavLink>
            <NavLink 
              to="/support" 
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaQuestionCircle className="inline mr-1" /> Support
            </NavLink>
            
            {/* Desktop Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-text-main text-sm hidden lg:flex items-center gap-2">
                  <FaUser className="text-accent" />
                  {user?.name || user?.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-700 flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <NavLink 
                to="/auth" 
                className="ml-4 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-600"
              >
                <FaUserPlus className="inline mr-1" /> Join
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-main hover:text-accent p-2 rounded-lg transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Shows/Hides based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card-bg border-t border-border-muted">
          <div className="px-4 py-2 space-y-1">
            <NavLink 
              to="/" 
              end
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-base font-medium w-full transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border-l-4 border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaHome className="mr-3" /> Home
            </NavLink>
            <NavLink 
              to="/build"
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-base font-medium w-full transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border-l-4 border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaTools className="mr-3" /> Get Started
            </NavLink>
            <NavLink 
              to="/saved"
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-base font-medium w-full transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border-l-4 border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaSave className="mr-3" /> Saved Builds
            </NavLink>
            <NavLink 
              to="/support"
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-base font-medium w-full transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10 border-l-4 border-accent' 
                  : 'text-text-sub hover:text-accent hover:bg-accent/10'
                }
              `}
            >
              <FaQuestionCircle className="mr-3" /> Support
            </NavLink>
            
            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <div className="border-t border-border-muted pt-2 mt-2">
                <div className="flex items-center px-3 py-2 text-text-main">
                  <FaUser className="text-accent mr-3" />
                  Welcome, {user?.name || user?.email || 'User'}
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    closeMobileMenu()
                  }}
                  className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-border-muted pt-2 mt-2">
                <NavLink 
                  to="/auth"
                  onClick={closeMobileMenu}
                  className="flex items-center w-full px-3 py-2 bg-accent text-white rounded-lg font-medium transition-all duration-200 hover:bg-purple-600"
                >
                  <FaUserPlus className="mr-3" /> Join Now
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
