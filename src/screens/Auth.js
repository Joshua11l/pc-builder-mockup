import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { loginUser, registerUser } from '../services/authService'
import { toast } from 'react-toastify'

/**
 * Auth Component
 * FR17: User registration
 * FR18: User login
 * Handles user authentication (login and registration)
 */
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login, logActivity } = useUser()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (!isLogin && password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    if (!isLogin && !name) {
      toast.error('Please enter your name')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      if (isLogin) {
        // FR18: User login
        const result = await loginUser(email, password)

        if (result.success) {
          const userData = {
            id: result.data.user.id,
            name: result.data.user.user_metadata?.full_name || email.split('@')[0],
            email: result.data.user.email,
            joinDate: result.data.user.created_at
          }

          login(userData)
          logActivity('user_login', userData)
          toast.success('Login successful!')
          navigate('/')
        } else {
          toast.error(result.error || 'Login failed')
        }
      } else {
        // FR17: User registration
        const result = await registerUser(email, password, name)

        if (result.success) {
          toast.success('Registration successful! Please check your email to verify your account.')
          setIsLogin(true)
          setName('')
          setPassword('')
          setConfirm('')
        } else {
          toast.error(result.error || 'Registration failed')
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/85 backdrop-blur-lg p-8 shadow-glow">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/25 to-secondary/20 blur-3xl opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-center text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-center text-text-sub">
              {isLogin
                ? 'Sign in to access your saved builds and preferences.'
                : 'Join the builder community and sync your configurations.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-white/80">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/80">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/80">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirm" className="block text-sm font-medium text-white/80">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-semibold py-3 px-4 transition-all duration-200 shadow-glow hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <p className="text-sm text-text-sub">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-secondary hover:text-white font-medium transition-colors duration-200"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
              
              {isLogin && (
                <p className="text-sm text-text-sub">
                  <button
                    type="button"
                    onClick={() => navigate('/password-reset')}
                    className="text-secondary hover:text-white font-medium transition-colors duration-200"
                  >
                    Forgot your password?
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
