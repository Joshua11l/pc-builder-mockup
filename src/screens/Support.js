import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaQuestionCircle, FaBug } from 'react-icons/fa'

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Support ticket submitted:', formData)
    alert('Support ticket submitted successfully! We will get back to you within 24 hours.')
    setFormData({ name: '', email: '', subject: '', message: '', category: 'general' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/10 text-xs uppercase tracking-[0.35em] text-text-sub">
            Support Center
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white">Need a hand? We’re on standby.</h1>
          <p className="mt-3 text-text-sub text-lg">
            Reach out for build advice, account help, or bug reports—our specialists usually respond within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 p-8 shadow-glow">
            <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-60" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-secondary" size={20} />
                  <div>
                    <div className="text-white font-medium">Email Support</div>
                    <div className="text-text-sub">support@pcbuildgenerator.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-secondary" size={20} />
                  <div>
                    <div className="text-white font-medium">Phone Support</div>
                    <div className="text-text-sub">1-800-PC-BUILD (722-8453)</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Support Hours</h3>
                <div className="space-y-2 text-text-sub">
                  <div>Monday - Friday: 9:00 AM - 8:00 PM EST</div>
                  <div>Saturday: 10:00 AM - 6:00 PM EST</div>
                  <div>Sunday: 12:00 PM - 5:00 PM EST</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Common Issues</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-text-sub">
                    <FaQuestionCircle className="text-secondary" size={16} />
                    Build compatibility questions
                  </div>
                  <div className="flex items-center gap-2 text-text-sub">
                    <FaBug className="text-secondary" size={16} />
                    Technical issues and bugs
                  </div>
                  <div className="flex items-center gap-2 text-text-sub">
                    <FaEnvelope className="text-secondary" size={16} />
                    Account and login problems
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card-elevated/80 backdrop-blur-8 p-8 shadow-glow">
            <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-gradient-to-br from-secondary/25 to-primary/25 blur-3xl opacity-60" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6">Submit a Support Request</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-white/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium text-white/80">
                    Issue Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="compatibility">Build Compatibility</option>
                    <option value="billing">Billing Question</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-white/80">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-white/80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Please provide details about your issue or question..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-semibold py-3 px-4 transition-all duration-200 shadow-glow hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Submit Support Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
