import React from 'react'
import { motion } from 'framer-motion'
import { QrCode, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'

const QRCodeComponent = dynamic(
  () => import('react-qr-code').then(mod => mod.default),
  { loading: () => <div className="w-48 h-48 bg-gray-200 rounded animate-pulse" /> }
)

export function QRSection({ session, attendanceUrl = '' }) {
  // Use a placeholder URL if no session is selected
  const qrValue = attendanceUrl || 'https://nifesapp.vercel.app/attend/no-session'
  
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      className="flex flex-col items-center justify-center rounded-2xl border border-indigo-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-8 backdrop-blur-xl shadow-lg shadow-indigo-900/5 dark:shadow-none text-center"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-indigo-900 dark:text-white">
          Scan to Mark Attendance
        </h3>
        <p className="mt-1 text-sm text-indigo-600 dark:text-gray-400">
          Use your device camera to check in
        </p>
      </div>

      {session ? (
        <>
          <div className="group relative mb-6 overflow-hidden rounded-xl bg-white p-4 shadow-xl shadow-indigo-900/10 dark:shadow-2xl transition-transform duration-300 hover:scale-105">
            <div className="relative h-48 w-48 bg-white flex items-center justify-center">
              <QRCodeComponent
                value={qrValue}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {attendanceUrl && (
            <a
              href={attendanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-400/10 hover:text-blue-700 dark:hover:text-blue-300 break-all max-w-xs"
            >
              <span className="truncate">{attendanceUrl.split('/').slice(-3).join('/')}</span>
              <ExternalLink className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100 flex-shrink-0" />
            </a>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <QrCode className="h-16 w-16 text-indigo-400 mx-auto mb-4 opacity-50" />
          <p className="text-sm text-indigo-600 dark:text-gray-500">
            Select a session to generate QR code
          </p>
        </div>
      )}
    </motion.div>
  )
}
