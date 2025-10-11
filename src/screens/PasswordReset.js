import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'

export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual password reset logic
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="bg-card-bg border border-border-muted rounded-xl p-8 w-full max-w-md shadow-lg text-center">
          <div className="mb-6">
            <FaEnvelope className="text-accent text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-text-sub">
              We've sent a password reset link to <strong className="text-accent">{email}</strong>
            </p>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
            <p className="text-text-main text-sm">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
              className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:bg-purple-700"
            >
              Try Different Email
            </button>
            
            <Link
              to="/auth"
              className="block w-full text-center text-text-sub hover:text-accent transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="bg-card-bg border border-border-muted rounded-xl p-8 w-full max-w-md shadow-lg">
        <div className="mb-6">
          <Link
            to="/auth"
            className="inline-flex items-center text-text-sub hover:text-accent transition-colors duration-200 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-text-sub">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-text-main font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-sub">
            Remember your password?{' '}
            <Link to="/auth" className="text-accent hover:text-purple-400 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}