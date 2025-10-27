/**
 * PC Builder Application - Main App Component
 * 
 * This is the root component that sets up:
 * - React Router for navigation between pages
 * - User Context Provider for authentication and activity logging
 * - Global styling with Tailwind CSS custom theme
 * - All main application routes
 * 
 * Features implemented:
 * - Single Page Application routing
 * - User authentication context
 * - Responsive design with dark theme
 * - Navigation between all functional screens
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';

// Screen components for different pages
import HomeScreen from './screens/HomeScreen';
import BuildScreen from './screens/BuildScreen';
import SavedBuildsScreen from './screens/SavedBuildsScreen';
import Auth from './screens/Auth';
import PasswordReset from './screens/PasswordReset';
import Support from './screens/Support';

/**
 * Main Application Component
 * Wraps the entire app with necessary providers and routing
 */
export default function App() {
  return (
    // UserProvider enables user authentication and activity logging throughout the app
    <UserProvider>
      {/* React Router enables client-side navigation */}
      <Router>
        {/* Main app container with dark theme styling */}
        <div className="relative min-h-screen text-text-main">
          {/* Navigation bar appears on all pages */}
          <Navbar />
          
          {/* Route definitions for all application pages */}
          <Routes>
            <Route path="/"              element={<HomeScreen />} />         {/* Landing page with hero section */}
            <Route path="/build"         element={<BuildScreen />} />        {/* PC build generation tool */}
            <Route path="/auth"          element={<Auth />} />               {/* Login/registration page */}
            <Route path="/password-reset" element={<PasswordReset />} />     {/* Password recovery page */}
            <Route path="/saved"         element={<SavedBuildsScreen />} />  {/* View saved PC builds */}
            <Route path="/support"       element={<Support />} />           {/* Customer support page */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}
