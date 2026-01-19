import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, UserPlus } from 'lucide-react'

export function AttendanceActions({
  searchQuery,
  onSearchChange,
  filteredMembers,
  memberStatus,
  onMarkPresent,
  onRegister,
  isLoadingPresent,
  showRegisterModal,
  onShowRegisterModal,
}) {
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
        delay: 0.4,
      }}
      className="rounded-2xl border border-indigo-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-lg shadow-indigo-900/5 dark:shadow-none"
    >
      <h3 className="mb-4 text-lg font-medium text-indigo-900 dark:text-white">
        Quick Actions
      </h3>
      <p className="mb-6 text-sm text-indigo-600 dark:text-gray-400">
        Manually register members or search for existing records.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search member name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-indigo-200 dark:border-white/10 bg-indigo-50 dark:bg-black/20 py-3 pl-10 pr-4 text-sm text-indigo-900 dark:text-white placeholder-indigo-400 dark:placeholder-gray-500 backdrop-blur-sm transition-all focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/50"
          />
        </div>
        <button
          onClick={onShowRegisterModal}
          className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register</span>
        </button>
      </div>

      {/* Search Results */}
      {filteredMembers.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto border border-indigo-200 dark:border-white/10 rounded-xl p-3 bg-indigo-50 dark:bg-black/20">
          {filteredMembers.map((member) => {
            const status = memberStatus[member._id] || 'Absent'
            return (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-lg border border-indigo-200 dark:border-white/10 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-indigo-900 dark:text-white">
                    {member.name}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-gray-400">
                    {member.email || member.phone}
                  </div>
                  <div className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded ${
                    status === 'Present'
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                      : status === 'New'
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300'
                      : 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300'
                  }`}>
                    {status}
                  </div>
                </div>
                {status !== 'Present' && (
                  <button
                    onClick={() => onMarkPresent(member._id)}
                    disabled={isLoadingPresent === member._id}
                    className="btn bg-green-500 text-white text-sm py-1 px-3 ml-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    {isLoadingPresent === member._id ? (
                      <>
                        <svg
                          className="animate-spin w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Marking</span>
                      </>
                    ) : (
                      <span>Mark Present</span>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
