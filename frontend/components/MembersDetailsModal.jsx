import React from 'react'
import { motion } from 'framer-motion'
import { X, Phone, Mail, MapPin, User } from 'lucide-react'

export function MembersDetailsModal({ open, onClose, members, title }) {
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}
