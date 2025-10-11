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
    // TODO: Implement support ticket submission
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
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
          <p className="text-text-sub text-lg">
            Need help? We're here to assist you with any questions or issues.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-card-bg border border-border-muted rounded-xl p-6">
            <h2 className="text-2xl font-bold text-accent mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-accent" size={20} />
                <div>
                  <div className="text-text-main font-medium">Email Support</div>
                  <div className="text-text-sub">support@pcbuildgenerator.com</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="text-accent" size={20} />
                <div>
                  <div className="text-text-main font-medium">Phone Support</div>
                  <div className="text-text-sub">1-800-PC-BUILD (722-8453)</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-text-main mb-4">Support Hours</h3>
              <div className="space-y-2 text-text-sub">
                <div>Monday - Friday: 9:00 AM - 8:00 PM EST</div>
                <div>Saturday: 10:00 AM - 6:00 PM EST</div>
                <div>Sunday: 12:00 PM - 5:00 PM EST</div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-text-main mb-4">Common Issues</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-text-sub">
                  <FaQuestionCircle className="text-accent" size={16} />
                  Build compatibility questions
                </div>
                <div className="flex items-center gap-2 text-text-sub">
                  <FaBug className="text-accent" size={16} />
                  Technical issues and bugs
                </div>
                <div className="flex items-center gap-2 text-text-sub">
                  <FaEnvelope className="text-accent" size={16} />
                  Account and login problems
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="bg-card-bg border border-border-muted rounded-xl p-6">
            <h2 className="text-2xl font-bold text-accent mb-6">Submit a Support Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-text-main font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-text-main font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-text-main font-medium mb-2">
                  Issue Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="general">General Question</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="compatibility">Build Compatibility</option>
                  <option value="billing">Billing Question</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-text-main font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-text-main font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-bg border border-border-muted rounded-lg text-text-main placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  placeholder="Please provide details about your issue or question..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Submit Support Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}