// src/screens/HomeScreen.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import pcVideo from '../assets/pc.mp4'
import './HomeScreen.css'

export default function HomeScreen() {
  const nav = useNavigate()

  return (
    <>
      <section className="hero-section">
        <video
          src={pcVideo}
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
        />
        <div className="hero-overlay" />
        <div className="hero-container">
          <h1 className="hero-title">BUILD YOUR PERFECT PC</h1>
          <p className="hero-subtitle">
            Generate optimized PC builds tailored to your budget and performance goals.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => nav('/build')}>
              Start Building
            </button>
            <button className="btn-secondary" onClick={() => nav('/saved')}>
              View Saved Builds
            </button>
          </div>
        </div>
      </section>

      <section className="get-started-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <span className="section-subtitle">
            Follow three simple steps to get your custom PC build.
          </span>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Enter Your Budget</h3>
              <p className="step-desc">
                Type in your maximum spend to get started.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Generate a Build</h3>
              <p className="step-desc">
                Instant recommendations with full compatibility checks.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Customize & Save</h3>
              <p className="step-desc">
                Tweak parts, save your build, and share it with friends.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
