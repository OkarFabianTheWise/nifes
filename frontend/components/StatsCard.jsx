import React from 'react'
import { motion } from 'framer-motion'

export function StatsCard({ label, value, icon: Icon, delay = 0, isLoading = false, onClick = null, user = null }) {
  const isAdmin = user && ['superadmin', 'admin'].includes(user.role);
  const isClickable = onClick && isAdmin;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
      }}
      onClick={isClickable ? onClick : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-indigo-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-lg shadow-indigo-900/5 dark:shadow-none transition-all duration-300 ${
        isClickable
          ? 'hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-blue-900/20 hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer'
          : ''
      }`}
      title={onClick && !isAdmin ? 'Only admins can view details' : ''}
    >
      <div className="relative z-10 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-indigo-600 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </span>
          {Icon && (
            <Icon className="h-5 w-5 text-indigo-600 dark:text-blue-400/70" />
          )}
        </div>
        <div className="text-4xl font-light text-indigo-900 dark:text-white tracking-tight">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-indigo-200 dark:bg-white/10 rounded animate-pulse" />
            </div>
          ) : (
            value
          )}
        </div>
      </div>

      {/* Subtle gradient glow effect on hover */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 dark:bg-blue-500/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
    </motion.div>
  )
}
