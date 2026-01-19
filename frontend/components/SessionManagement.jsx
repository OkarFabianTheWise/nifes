import { motion } from 'framer-motion';
import { Calendar, RefreshCw, Plus } from 'lucide-react';

export function SessionManagement({
  currentSession,
  onRefresh,
  onNewSession,
  isLoadingStats,
}) {
  const isTesting = process.env.NEXT_PUBLIC_TESTING === 'true';

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-white/5 rounded-lg p-4 shadow-sm border border-indigo-200 dark:border-white/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Active Session</p>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {currentSession?.name || currentSession?.title || 'No Session'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatDate(currentSession?.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewSession}
            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="Create new session"
          >
            <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </motion.button>
          {isTesting && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isLoadingStats}
              className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh session data"
            >
              <RefreshCw
                className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 ${
                  isLoadingStats ? 'animate-spin' : ''
                }`}
              />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
