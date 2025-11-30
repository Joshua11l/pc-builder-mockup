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
      {/* Hero Section with immersive visual */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-stretch">
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.4em] text-text-sub self-start">
              Next-gen PC Planning
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              Build your dream PC in minutes
            </h1>
            <p className="mt-6 text-lg text-text-sub max-w-2xl">
              We analyze real-world vendor data and compatibility rules so you can focus on performance, aesthetics, and budget—all in a single streamlined experience.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => nav('/build')}
                className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full text-base font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-200"
              >
                Start Building
              </button>
              <button
                onClick={() => nav('/saved')}
                className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full border border-white/15 text-base font-semibold text-white/80 hover:text-white hover:border-white/30 transition-all duration-200 bg-white/5"
              >
                View Saved Builds
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Compatibility checks', value: '24+' },
                { label: 'Live vendor sources', value: '5' },
                { label: 'Satisfied builders', value: '12k+' }
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/5 px-5 py-4 border border-white/10 backdrop-blur-8"
                >
                  <div className="text-xs uppercase tracking-wide text-text-sub">{stat.label}</div>
                  <div className="text-2xl font-semibold text-white mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-full min-h-[380px] lg:min-h-[520px]">
            <div className="absolute -inset-6 bg-card-gradient opacity-70 blur-3xl" />
            <div className="relative h-full rounded-3xl overflow-hidden border border-white/10 shadow-glow">
              <video
                src={pcVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-soft/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Explains the 3-step process */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">From idea to components—three elegant steps.</h2>
          <p className="mt-4 text-lg text-text-sub max-w-2xl mx-auto">
            Whether you’re gaming, rendering, or editing, we translate your budget into a balanced build with clear upgrade paths.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                step: '01',
                title: 'Set your goals',
                description: 'Tell us how you’ll use your machine and the budget you’re working with.',
              },
              {
                step: '02',
                title: 'Review smart picks',
                description: 'We generate optimized parts lists with supply, pricing, and compatibility baked in.',
              },
              {
                step: '03',
                title: 'Fine-tune & share',
                description: 'Swap components, export build sheets, and save your perfect configuration.',
              }
            ].map(card => (
              <div
                key={card.step}
                className="relative rounded-3xl bg-card-elevated/80 border border-white/10 px-8 py-10 text-left backdrop-blur-8 shadow-glow transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="text-sm font-semibold text-white/70">Step {card.step}</span>
                <h3 className="mt-3 text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 text-text-sub">{card.description}</p>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 blur-2xl opacity-70" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
