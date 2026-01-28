import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Phone, Mail, MapPin, User, Send } from 'lucide-react'

export function MembersDetailsModal({ open, onClose, members, title }) {
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [subjectText, setSubjectText] = useState('')

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert('Please enter a message')
      return
    }

    if (!subjectText.trim()) {
      alert('Please enter a subject')
      return
    }

    // Collect all email addresses
    const emails = members
      .filter((m) => m.email)
      .map((m) => m.email)
      .join(', ')

    if (!emails) {
      alert('No email addresses found for this group')
      return
    }

    // Use setTimeout to allow state updates and then open mailto
    setTimeout(() => {
      // Create mailto link with proper encoding
      const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(messageText)}`
      
      // Open the mailto link directly
      window.location.href = mailtoLink
    }, 100)
    
    setMessageText('')
    setSubjectText('')
    setShowMessageModal(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-white/10 rounded-2xl border border-stone-200 dark:border-white/10 backdrop-blur-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-white/10">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {members && members.length > 0 ? (
            <div className="divide-y divide-stone-200 dark:divide-white/10">
              {members.map((member, idx) => (
                <motion.div
                  key={member._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-stone-900 dark:text-white truncate">
                        {member.name}
                      </h3>

                      <div className="mt-2 space-y-1 text-sm">
                        {member.phone && (
                          <div className="flex items-center gap-2 text-stone-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                            <a
                              href={`tel:${member.phone}`}
                              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                            >
                              {member.phone}
                            </a>
                          </div>
                        )}

                        {member.email && (
                          <div className="flex items-center gap-2 text-stone-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                            >
                              {member.email}
                            </a>
                          </div>
                        )}

                        {member.address && (
                          <div className="flex items-start gap-2 text-stone-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                            <span className="line-clamp-2">{member.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-stone-600 dark:text-gray-400">
              <p className="text-lg">No members to display</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-white/10 flex justify-between items-center">
          <span className="text-sm text-stone-600 dark:text-gray-400">
            Total: <strong>{members ? members.length : 0}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Message
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>

      {/* Message Modal */}
      {showMessageModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
        >
          <div className="bg-white dark:bg-white/10 rounded-2xl border border-stone-200 dark:border-white/10 backdrop-blur-xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-white/10">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Send Message to {title}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full p-3 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-50 dark:bg-black/20 text-stone-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-3 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-50 dark:bg-black/20 text-stone-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none"
                  rows="5"
                />
              </div>

              <div className="text-sm text-stone-600 dark:text-gray-400">
                <p>This will open your email client with all {title.toLowerCase()} emails pre-filled.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 dark:border-white/10 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowMessageModal(false)
                  setMessageText('')
                  setSubjectText('')
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-white/10 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
