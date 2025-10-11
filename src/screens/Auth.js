import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

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
    if (!email || !password || (!isLogin && (password !== confirm || !name))) {
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now().toString(),
        name: name || email.split('@')[0],
        email,
        joinDate: new Date().toISOString()
      }
      
      login(userData)
      logActivity(isLogin ? 'user_login' : 'user_registration', userData)
      navigate('/')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="bg-card-bg border border-border-muted rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-text-main font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-text-main font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-text-main font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirm" className="block text-text-main font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirm"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </div>
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-text-sub">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:text-purple-400 cursor-pointer ml-1 font-medium"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </span>
          </p>
          
          {isLogin && (
            <p className="text-text-sub">
              <span 
                onClick={() => navigate('/password-reset')}
                className="text-accent hover:text-purple-400 cursor-pointer font-medium"
              >
                Forgot your password?
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
