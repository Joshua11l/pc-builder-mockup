import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { resetPassword } from '../services/authService'

/**
 * PasswordReset Component
 * FR19: Password reset
 * Handles password reset functionality
 */
export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)

    const result = await resetPassword(email)

    if (result.success) {
      setIsSubmitted(true)
      toast.success('Password reset email sent!')
    } else {
      toast.error(result.error || 'Failed to send reset email')
    }

    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/85 backdrop-blur-lg p-8 w-full max-w-md text-center shadow-glow">
          <div className="absolute -top-16 right-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-60" />
          <div className="relative mb-6">
            <FaEnvelope className="text-secondary text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-text-sub">
              We've sent a password reset link to <strong className="text-secondary">{email}</strong>
            </p>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 mb-6">
            <p className="text-text-sub text-sm">
              Didn't receive the email? Check your spam folder or request another link after a few minutes.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-semibold py-3 px-4 transition-all duration-200 shadow-glow hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
            >
              Try Different Email
            </button>
            
            <Link
              to="/auth"
              className="block w-full text-center text-text-sub hover:text-white transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/85 backdrop-blur-lg p-8 w-full max-w-md shadow-glow">
        <div className="absolute -right-16 -bottom-20 h-44 w-44 rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 blur-3xl opacity-60" />
        <div className="relative mb-6">
          <Link
            to="/auth"
            className="inline-flex items-center text-text-sub hover:text-white transition-colors duration-200 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-text-sub">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/80">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-semibold py-3 px-4 transition-all duration-200 shadow-glow hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-sub">
            Remember your password?{' '}
            <Link to="/auth" className="text-secondary hover:text-white font-medium transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
