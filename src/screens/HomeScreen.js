import React from 'react'
import { useNavigate } from 'react-router-dom'
import pcVideo from '../assets/pc.mp4'

/**
 * Home Screen - Landing Page Component (FR1, FR4)
 * Main landing page with hero section, background video, call-to-action buttons,
 * and "How It Works" section explaining the 3-step process with responsive design
 */
export default function HomeScreen() {
  const nav = useNavigate()

  return (
    <>
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden h-[85vh] min-h-[500px] flex items-center justify-center text-center">
        {/* Background Video - Auto-playing PC assembly footage */}
        <video
          src={pcVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-0"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Main Hero Content with Glassmorphism Effect */}
        <div className="relative z-20 max-w-4xl px-8 py-8 bg-black/50 backdrop-blur-8 rounded-xl shadow-2xl">
          <h1 className="text-5xl font-extrabold mb-2 text-white drop-shadow-lg">BUILD YOUR PERFECT PC</h1>
          <p className="text-xl mb-10 text-white drop-shadow-md">
            Generate optimized PC builds tailored to your budget and performance goals.
          </p>
          {/* Call-to-Action Buttons */}
          <div className="flex justify-center gap-4">
            {/* Primary CTA - Navigate to Build Screen */}
            <button 
              className="px-6 py-3 bg-accent text-bg border-none rounded-xl font-semibold text-base transition-all duration-200 ease-in-out shadow-lg shadow-black/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50 hover:bg-purple-700 hover:text-white"
              onClick={() => nav('/build')}
            >
              Start Building
            </button>
            {/* Secondary CTA - Navigate to Saved Builds */}
            <button 
              className="px-6 py-3 bg-transparent text-accent border-2 border-accent rounded-xl font-semibold text-base transition-all duration-200 ease-in-out shadow-lg shadow-black/40 hover:bg-accent hover:text-bg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50"
              onClick={() => nav('/saved')}
            >
              View Saved Builds
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section - Explains the 3-step process */}
      <section className="bg-bg py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-2 text-text-main">How It Works</h2>
          <span className="text-gray-100 mb-8 text-lg block">
            Follow three simple steps to get your custom PC build.
          </span>
          {/* Three-Step Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Step 1: Budget Input */}
            <div className="bg-card-bg border border-border-muted rounded-xl p-8 text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent text-bg rounded-full flex items-center justify-center font-bold mx-auto mb-4 text-xl">1</div>
              <h3 className="text-xl font-semibold mb-2 text-text-main">Enter Your Budget</h3>
              <p className="text-gray-100 text-base">
                Type in your maximum spend to get started.
              </p>
            </div>
            {/* Step 2: Build Generation */}
            <div className="bg-card-bg border border-border-muted rounded-xl p-8 text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent text-bg rounded-full flex items-center justify-center font-bold mx-auto mb-4 text-xl">2</div>
              <h3 className="text-xl font-semibold mb-2 text-text-main">Generate a Build</h3>
              <p className="text-gray-100 text-base">
                Instant recommendations with full compatibility checks.
              </p>
            </div>
            {/* Step 3: Customization and Saving */}
            <div className="bg-card-bg border border-border-muted rounded-xl p-8 text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent text-bg rounded-full flex items-center justify-center font-bold mx-auto mb-4 text-xl">3</div>
              <h3 className="text-xl font-semibold mb-2 text-text-main">Customize & Save</h3>
              <p className="text-gray-100 text-base">
                Tweak parts, save your build, and share it with friends.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
