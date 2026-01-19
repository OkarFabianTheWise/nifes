import React from 'react'
import { motion } from 'framer-motion'
import { UserCheck } from 'lucide-react'

export function MemberRollCall({ members = [], isLoading = false }) {
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
        delay: 0.2,
      }}
      className="flex h-full flex-col rounded-2xl border border-indigo-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-lg shadow-indigo-900/5 dark:shadow-none"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-medium text-indigo-900 dark:text-white">
          Live Roll Call
        </h3>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 dark:bg-green-500/10 px-3 py-1 border border-emerald-500/20 dark:border-green-500/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 dark:bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-700 dark:text-green-400">
            Live
          </span>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-300 dark:scrollbar-thumb-white/10 hover:scrollbar-thumb-indigo-400 dark:hover:scrollbar-thumb-white/20"
              style={{
                height: '100%',
              }}
            >
              <div className="space-y-3">
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <motion.div
                      key={member._id}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.3 + index * 0.05,
                      }}
                      className="group flex items-center justify-between rounded-xl border border-indigo-200 dark:border-white/5 bg-indigo-50 dark:bg-white/5 p-3 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md hover:shadow-indigo-900/5 dark:hover:shadow-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200 dark:bg-white/5 text-xs font-medium text-indigo-600 dark:text-gray-400 group-hover:bg-indigo-300 dark:group-hover:bg-white/10 group-hover:text-indigo-700 dark:group-hover:text-white transition-colors">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-indigo-900 dark:text-gray-200">
                          {member.name}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border ${
                        member.isPresent 
                          ? 'bg-emerald-500/10 dark:bg-green-500/10 text-emerald-700 dark:text-green-400 border-emerald-500/20 dark:border-green-500/20'
                          : 'bg-orange-500/10 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/20'
                      }`}>
                        <UserCheck className="h-3 w-3" />
                        {member.isPresent ? 'Present' : 'Absent'}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-500">
                    No members yet
                  </div>
                )}
              </div>
            </div>

            {/* Fade at bottom for scroll hint */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-indigo-50/80 dark:from-[#0a0a0a] to-transparent opacity-80" />
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-stone-500 dark:text-gray-500">
        {members.length} {members.length === 1 ? 'member' : 'members'} total
      </p>
    </motion.div>
  )
}
