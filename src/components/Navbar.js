import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTools, FaSave } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">PC Build Gen</div>
      <div className="navbar-links">
        <NavLink to="/"      className="navbar-link">
          <FaHome className="nav-icon" /> Get Started
        </NavLink>
        <NavLink to="/build" className="navbar-link">
          <FaTools className="nav-icon" /> Build
        </NavLink>
        <NavLink to="/saved" className="navbar-link">
          <FaSave className="nav-icon" /> Saved Builds
        </NavLink>
      </div>
    </nav>
  );
}
