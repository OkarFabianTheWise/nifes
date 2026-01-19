import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export function Toast({ message, type = 'success', isOpen, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [isOpen, onClose, duration])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 max-w-sm z-50 rounded-lg shadow-lg p-4 flex items-center gap-3 ${
            type === 'success'
              ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
              : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20'
          }`}
        >
          {type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          )}
          <span
            className={`text-sm font-medium flex-1 ${
              type === 'success'
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {message}
          </span>
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
