import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

/**
 * Modern Modal Component
 * Reusable modal with sleek design matching the app theme
 */
export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full ${maxWidth} rounded-3xl border border-white/15 bg-card-elevated/95 shadow-2xl animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-16 right-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-60" />

        <div className="relative px-6 sm:px-8 py-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-text-sub hover:text-white hover:bg-white/10 transition-colors duration-200"
              aria-label="Close modal"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Confirm Modal - Replacement for window.confirm()
 */
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-text-sub mb-6">{message}</p>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-white/15 text-text-sub hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
            isDanger
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-primary text-white hover:bg-primary/90 shadow-glow'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}

/**
 * Prompt Modal - Replacement for window.prompt()
 */
export function PromptModal({ isOpen, onClose, onSubmit, title, message, placeholder = '', defaultValue = '', confirmText = 'Submit', cancelText = 'Cancel' }) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
    }
  }, [isOpen, defaultValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        {message && <p className="text-text-sub mb-4">{message}</p>}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-text-sub focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all duration-200"
          autoFocus
        />

        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-white/15 text-text-sub hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmText}
          </button>
        </div>
      </form>
    </Modal>
  )
}
