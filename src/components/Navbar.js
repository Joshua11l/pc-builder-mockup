// src/components/Navbar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaTools, FaSave } from 'react-icons/fa'
import './Navbar.css'
import logo from '../assets/pc-logo.png'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="PC Builder Logo" className="logo-img" />
        <span className="logo-text">PC Build Generator</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className="navbar-link">
          <FaHome className="nav-icon" /> Home
        </NavLink>
        <NavLink to="/build" className="navbar-link">
          <FaTools className="nav-icon" /> Get Started
        </NavLink>
        <NavLink to="/saved" className="navbar-link">
          <FaSave className="nav-icon" /> Saved Builds
        </NavLink>
      </div>
    </nav>
  )
}
