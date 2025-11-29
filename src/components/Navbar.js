import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaHome, FaTools, FaSave, FaUserPlus, FaQuestionCircle, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { useUser } from '../context/UserContext'
import { logoutUser } from '../services/authService'
import { toast } from 'react-toastify'
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
  const handleLogout = async () => {
    const result = await logoutUser()

    if (result.success) {
      logout()
      toast.success('Logged out successfully!', { position: 'top-right' })
      navigate('/')
    } else {
      toast.error('Logout failed: ' + result.error, { position: 'top-right' })
    }
  }

  /**
   * Close mobile menu when clicking on a navigation link
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  
  const linkClass = ({ isActive }) =>
    `
      inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
      ${isActive
        ? 'bg-white/15 text-white shadow-glow'
        : 'text-text-sub hover:text-white hover:bg-white/10'
      }
    `

  return (
    // Main Navigation Bar with glassmorphism and responsive layout
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo and Title */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group flex-shrink-0"
          >
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/20 border border-primary/30 shadow-inner-glow">
              <img src={logo} alt="PC Builder Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.3em] text-text-sub">PC Builder</span>
              <span className="text-sm sm:text-base font-semibold text-white group-hover:text-primary transition-colors duration-200">
                Forge Your Perfect Build
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-2xl">
            <NavLink to="/" end className={linkClass}>
              <FaHome className="text-white/70" />
              <span className="hidden xl:inline">Home</span>
            </NavLink>
            <NavLink to="/build" className={linkClass}>
              <FaTools className="text-white/70" />
              <span className="hidden xl:inline">Build</span>
            </NavLink>
            <NavLink to="/saved" className={linkClass}>
              <FaSave className="text-white/70" />
              <span className="hidden xl:inline">Saved</span>
            </NavLink>
            <NavLink to="/support" className={linkClass}>
              <FaQuestionCircle className="text-white/70" />
              <span className="hidden xl:inline">Support</span>
            </NavLink>
            {!isAuthenticated && (
              <NavLink to="/auth" className={linkClass}>
                <FaUserPlus className="text-white/70" />
                <span className="hidden xl:inline">Join Now</span>
              </NavLink>
            )}
          </div>

          {/* Desktop User Info - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs xl:text-sm text-white max-w-[150px]">
                <FaUser className="text-accent flex-shrink-0" />
                <span className="truncate">{user?.name || user?.email || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-200 whitespace-nowrap"
              >
                <FaSignOutAlt />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Shows/Hides based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-bg/95 backdrop-blur-8">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
            <NavLink to="/" end onClick={closeMobileMenu} className={linkClass}>
              <FaHome className="text-white/70" />
              Home
            </NavLink>
            <NavLink to="/build" onClick={closeMobileMenu} className={linkClass}>
              <FaTools className="text-white/70" />
              Build
            </NavLink>
            <NavLink to="/saved" onClick={closeMobileMenu} className={linkClass}>
              <FaSave className="text-white/70" />
              Saved Builds
            </NavLink>
            <NavLink to="/support" onClick={closeMobileMenu} className={linkClass}>
              <FaQuestionCircle className="text-white/70" />
              Support
            </NavLink>
            <NavLink to="/auth" onClick={closeMobileMenu} className={linkClass}>
              <FaUserPlus className="text-white/70" />
              Join Now
            </NavLink>

            {/* Mobile Authentication */}
            {isAuthenticated ? (
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-white">
                  <FaUser className="text-accent" />
                  <div>
                    <div className="text-xs uppercase text-text-sub tracking-wide">Logged in as</div>
                    <div className="text-sm font-semibold">{user?.name || user?.email || 'User'}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    closeMobileMenu()
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 pt-3 mt-3">
                <button
                  onClick={() => {
                    navigate('/auth')
                    closeMobileMenu()
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow-glow hover:bg-primary/90 transition-all duration-200"
                >
                  <FaUserPlus />
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
