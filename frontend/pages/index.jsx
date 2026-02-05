import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Moon,
  Sun,
} from 'lucide-react'
import axios from 'axios'
import { StatsCard } from '../components/StatsCard'
import { MemberRollCall } from '../components/MemberRollCall'
import { QRSection } from '../components/QRSection'
import { AttendanceActions } from '../components/AttendanceActions'
import { SessionManagement } from '../components/SessionManagement'
import MemberModal from '../components/MemberModal'
import { useTheme } from '../hooks/useTheme'
import { Toast } from '../components/Toast'
import { MembersDetailsModal } from '../components/MembersDetailsModal'

const RegisterMemberModal = ({ open, onClose, onRegister, showToast }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return showToast('Name is required', 'error')
    if (!phone.trim()) return showToast('Phone is required', 'error')

    setLoading(true)
    try {
      await onRegister({ name, email, phone, address })
    } finally {
      setLoading(false)
      setName('')
      setEmail('')
      setPhone('')
      setAddress('')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-white/10 rounded-2xl p-6 w-full max-w-md border border-stone-200 dark:border-white/10 backdrop-blur-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
            Register New Member
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="w-full p-2 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-50 dark:bg-black/20 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-2 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-50 dark:bg-black/20 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-50 dark:bg-black/20 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              rows="3"
              className="w-full p-2 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-50 dark:bg-black/20 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex gap-2 mt-4 pt-2 border-t border-stone-200 dark:border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register & Mark Present'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-300 dark:bg-white/10 text-stone-900 dark:text-white px-4 py-2 rounded-lg hover:bg-stone-400 dark:hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const CreateSessionModal = ({ open, onClose, onCreate, showToast }) => {
  const [sessionName, setSessionName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sessionName.trim()) return showToast('Session name is required', 'error')

    setLoading(true)
    try {
      await onCreate(sessionName)
    } finally {
      setLoading(false)
      setSessionName('')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-white/10 rounded-2xl p-6 w-full max-w-md border border-indigo-200 dark:border-white/10 backdrop-blur-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-white">
            Create New Session
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-700 dark:text-gray-300 mb-2">
              Session Name *
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Sunday Service, Meeting 1"
              className="w-full p-3 border border-indigo-200 dark:border-white/10 rounded-lg bg-indigo-50 dark:bg-black/20 text-indigo-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-indigo-200 dark:border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Session'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-white/10 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [user, setUser] = useState(null)

  // determine if the currently loaded user is an admin
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin' || (Array.isArray(user.roles) && (user.roles.includes('admin') || user.roles.includes('superadmin'))))
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [showToastNotif, setShowToastNotif] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
  }, [])

  const showToast = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToastNotif(true)
  }
  const [session, setSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [stats, setStats] = useState({
    totalMembers: 0,
    presentToday: 0,
    firstTimers: 0,
    absent: 0,
  })
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [exportOpen, setExportOpen] = useState(false)
  const [exportOptions, setExportOptions] = useState({ present: true, absent: false, firstTimer: false })
  const [searchQuery, setSearchQuery] = useState('')
  const [allMembers, setAllMembers] = useState([])
  const [memberStatus, setMemberStatus] = useState({})
  const [filteredMembers, setFilteredMembers] = useState([])
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showNewSessionModal, setShowNewSessionModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  // Auto-close success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingPresent, setLoadingPresent] = useState(null)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [modalMembers, setModalMembers] = useState([])
  const [modalTitle, setModalTitle] = useState('')

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl])

  // If URL contains sessionId or view=active, select that session
  useEffect(() => {
    if (!router.isReady) return
    const { sessionId, view } = router.query
    if (sessionId) {
      if (sessions && sessions.length > 0) {
        const found = sessions.find((s) => (s._id || s.id) === sessionId)
        if (found) {
          setSession(found)
          return
        }
      }

      // fallback: try fetching the session by id
      ;(async () => {
        try {
          const res = await axios.get(`${apiUrl}/api/sessions/${sessionId}`)
          const s = res.data.session || res.data
          if (s) setSession(s)
        } catch (err) {
          console.error('Failed to fetch session by id from query:', err)
        }
      })()
    } else if (view === 'active') {
      if (sessions && sessions.length > 0) {
        setSession(sessions[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query, sessions, apiUrl])

  useEffect(() => {
    refreshStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, apiUrl])

  useEffect(() => {
    // Filter members based on search query
    if (searchQuery.trim()) {
      setFilteredMembers(
        allMembers.filter((m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredMembers([])
    }
  }, [searchQuery, allMembers])

  async function fetchSessions() {
    if (!apiUrl) return
    setLoadingSessions(true)
    try {
      const res = await axios.get(`${apiUrl}/api/sessions`)
      const sessionsData = res.data.sessions || res.data || []
      setSessions(sessionsData)
      // Auto-select the first session if available and none is selected
      if (sessionsData.length > 0 && !session) {
        setSession(sessionsData[0])
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  async function refreshStats() {
    if (!apiUrl) return
    setLoadingStats(true)
    console.log('Refreshing stats for session:', session)
    try {
      // Fetch all members
      const mRes = await axios.get(`${apiUrl}/api/members`)
      const members = mRes.data.members || []
      console.log('Fetched members:', members.length)
      setAllMembers(members)

      // Fetch current attendance
      const aRes = await axios.get(`${apiUrl}/api/attendance/current`)
      const allAttendance = aRes.data || []
      setAttendanceRecords(allAttendance)
      console.log('Fetched attendance records:', allAttendance.length)

      const sessionId = session && (session._id || session.id)
      const sessionAttendance = sessionId
        ? allAttendance.filter(
            (r) =>
              r.sessionId && (r.sessionId._id || r.sessionId) === sessionId
          )
        : []
      const presentCount = sessionAttendance.length
      console.log('Present count for session:', presentCount)

      // Build session attendance map
      const memberSessionAttendance = {}
      sessionAttendance.forEach((r) => {
        const mid = r.memberId && (r.memberId._id || r.memberId)
        if (mid) {
          memberSessionAttendance[mid] = true
        }
      })

      // Determine status for each member (Present, New/FirstTimer, or Absent)
      const statusMap = {}
      let firstTimersCount = 0
      let absentCount = 0

      members.forEach((m) => {
        const mid = m._id
        const isPresent = memberSessionAttendance[mid]

        if (isPresent) {
          statusMap[mid] = 'Present'
        } else {
          // Check if first timer (first attendance ever)
          const memberAttendanceCount = allAttendance.filter(
            (r) => r.memberId && (r.memberId._id || r.memberId) === mid
          ).length

          if (memberAttendanceCount === 0) {
            statusMap[mid] = 'New'
          } else {
            statusMap[mid] = 'Absent'
            absentCount++
          }
        }
      })

      // Fetch first timers count from session stats (admin may have additional filtering, but absent is now calculated locally)
      if (sessionId) {
        try {
          const statsRes = await axios.get(`${apiUrl}/api/sessions/${sessionId}/stats`)
          firstTimersCount = statsRes.data.firstTimers || 0
          console.log('Session first timers:', firstTimersCount)
        } catch (err) {
          console.error('Failed to fetch session stats:', err)
          // Count first timers locally as fallback
          firstTimersCount = Object.values(statusMap).filter(s => s === 'New').length
        }
      }

      setMemberStatus(statusMap)

      const newStats = {
        totalMembers: members.length,
        presentToday: presentCount,
        firstTimers: firstTimersCount,
        absent: absentCount,
      }
      console.log('Setting stats:', newStats)
      setStats(newStats)
    } catch (err) {
      console.error('Error refreshing stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  async function markPresent(memberId) {
    if (!apiUrl || !session) return showToast('No session selected', 'error')
    const member = allMembers.find((m) => m._id === memberId)
    if (!member) return showToast('Member not found', 'error')
    setLoadingPresent(memberId)
    try {
      await axios.post(`${apiUrl}/api/attendance`, {
        sessionId: session._id || session.id,
        email: member.email,
      })
      showToast(`✓ ${member.name} marked present`, 'success')
      setSearchQuery('')
      await refreshStats()
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        'Failed'
      showToast(msg, 'error')
    } finally {
      setLoadingPresent(null)
    }
  }

  async function registerAndMarkFromModal(newMemberData) {
    if (!apiUrl || !session) return showToast('No session selected', 'error')
    try {
      const response = await axios.post(`${apiUrl}/api/members`, {
        sessionId: session._id || session.id,
        ...newMemberData,
      })
      setSearchQuery('')
      setShowRegisterModal(false)
      setSuccessMessage({
        name: newMemberData.name,
        message:
          response.data.message ||
          'Member registered and marked present successfully!',
      })
      refreshStats()
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        'Failed'
      showToast(msg, 'error')
    }
  }

  async function createNewSession(sessionName) {
    if (!apiUrl) return showToast('API URL not configured', 'error')
    if (!sessionName.trim()) return showToast('Session name is required', 'error')
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) return showToast('You must be logged in as an admin to create a session', 'error')
      const response = await axios.post(
        `${apiUrl}/api/sessions`,
        {
          name: sessionName,
          date: new Date(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const newSession = response.data.session || response.data
      setSession(newSession)
      setSessions([...sessions, newSession])
      setShowNewSessionModal(false)
      setSuccessMessage({
        name: sessionName,
        message: 'Session created successfully!',
      })
      refreshStats()
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        'Failed to create session'
      showToast(msg, 'error')
    }
  }

  function handleShowFirstTimers() {
    const firstTimers = allMembers.filter(
      (m) => memberStatus[m._id] === 'New'
    )
    setModalMembers(firstTimers)
    setModalTitle('First Timers')
    setShowMembersModal(true)
  }

  function handleShowAbsent() {
    const absent = allMembers.filter(
      (m) => memberStatus[m._id] === 'Absent'
    )
    setModalMembers(absent)
    setModalTitle('Absent Members')
    setShowMembersModal(true)
  }

  function handleShowPresent() {
    const present = allMembers.filter(
      (m) => memberStatus[m._id] === 'Present'
    )
    setModalMembers(present)
    setModalTitle('Present Members')
    setShowMembersModal(true)
  }

  // Get members with present status for roll call
  const membersForRollCall = allMembers.map((m) => ({
    ...m,
    isPresent: memberStatus[m._id] === 'Present',
  }))

  const attendanceUrl = session
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/attend/${
        session._id || session.id
      }`
    : ''

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-indigo-50 dark:bg-[#0a0a0a] text-indigo-900 dark:text-gray-200 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Background Depth Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Light theme background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/40 to-blue-50/30 dark:from-[#0a0a0a] dark:via-[#111111] dark:to-[#050505]" />

        {/* Mesh gradients */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-400/10 dark:bg-blue-900/10 rounded-full blur-[140px] opacity-60 dark:opacity-30 mix-blend-normal dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-indigo-900/10 rounded-full blur-[120px] opacity-50 dark:opacity-20 mix-blend-normal dark:mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/5 dark:bg-blue-900/5 rounded-full blur-[160px] opacity-40" />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] dark:opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Theme Toggle */}
        <header className="mb-12 flex flex-col items-center text-center relative">
          {/* Theme Toggle Button */}
          <motion.button
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
            }}
            onClick={toggleTheme}
            className="absolute right-0 top-0 flex items-center gap-2 rounded-2xl border border-indigo-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2.5 backdrop-blur-xl transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-blue-900/20 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4 text-indigo-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-indigo-700 dark:text-gray-300">
                  Dark
                </span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-stone-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-stone-700 dark:text-gray-300">
                  Light
                </span>
              </>
            )}
          </motion.button>

          <motion.img
            src="/nifes-logo.png"
            alt="NIFES Logo"
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mb-4 h-16 w-16 object-contain"
          />
          <motion.h1
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="text-3xl font-bold tracking-tight text-indigo-900 dark:text-white sm:text-4xl"
          >
            Fellowship Attendance
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="mt-2 text-indigo-600 dark:text-gray-400"
          >
            Real-time monitoring and session management
          </motion.p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column - Stats & Roll Call */}
          <div className="space-y-6 lg:col-span-7">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatsCard
                label="Total Members"
                value={stats.totalMembers}
                icon={Users}
                delay={0.1}
                isLoading={loadingStats}
                user={user}
                onClick={() => {
                  setModalMembers(allMembers)
                  setModalTitle('All Members')
                  setShowMembersModal(true)
                }}
              />
              <StatsCard
                label="Present Today"
                value={stats.presentToday}
                icon={UserCheck}
                delay={0.2}
                isLoading={loadingStats}
                user={user}
                onClick={handleShowPresent}
              />
              <StatsCard
                label="First Timers"
                value={stats.firstTimers}
                icon={UserPlus}
                delay={0.3}
                isLoading={loadingStats}
                user={user}
                onClick={handleShowFirstTimers}
              />
              <StatsCard
                label="Absent"
                value={stats.absent}
                icon={UserX}
                delay={0.4}
                isLoading={loadingStats}
                user={user}
                onClick={handleShowAbsent}
              />
            </div>

            {/* Roll Call Section */}
            <div className="h-[500px]">
              <MemberRollCall
                members={membersForRollCall}
                isLoading={loadingStats}
              />
            </div>
          </div>

          {/* Right Column - Actions & QR */}
          <div className="space-y-6 lg:col-span-5">
            <QRSection session={session} attendanceUrl={attendanceUrl} />
            {isAdmin && (
              <div className="mt-4">
                <button
                  onClick={() => setExportOpen(true)}
                  className={`px-3 py-2 rounded ${theme === 'dark' ? 'bg-white/10 text-white border border-white/10' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                >
                  Export Session Data
                </button>
              </div>
            )}
            <AttendanceActions
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredMembers={filteredMembers}
              memberStatus={memberStatus}
              onMarkPresent={markPresent}
              onRegister={() => {}}
              isLoadingPresent={loadingPresent}
              showRegisterModal={showRegisterModal}
              onShowRegisterModal={() => setShowRegisterModal(true)}
            />
            <SessionManagement
              currentSession={session}
              onRefresh={refreshStats}
              onNewSession={() => setShowNewSessionModal(true)}
              isLoadingStats={loadingStats}
              user={user}
            />
          </div>
        </div>
      </div>

      <MemberModal
        open={false}
        onClose={() => {}}
        apiUrl={apiUrl}
        sessionId={session && (session._id || session.id)}
        onMarked={() => refreshStats()}
        showToast={showToast}
      />

      {/* Register New Member Modal */}
      {showRegisterModal && (
        <RegisterMemberModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegister={registerAndMarkFromModal}
          showToast={showToast}
        />
      )}

      {/* New Session Modal */}
      {showNewSessionModal && (
        <CreateSessionModal
          open={showNewSessionModal}
          onClose={() => setShowNewSessionModal(false)}
          onCreate={createNewSession}
          showToast={showToast}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isOpen={showToastNotif}
        onClose={() => setShowToastNotif(false)}
      />

      {/* Members Details Modal */}
      <MembersDetailsModal
        open={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        members={modalMembers}
        title={modalTitle}
      />

      {/* Export Modal (uses client-side attendanceRecords and allMembers) */}
      {exportOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 w-full max-w-md border-stone-200 bg-white dark:bg-[#0a0a0a] dark:text-white dark:border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Export Session Data</h3>
              <button onClick={() => setExportOpen(false)} className="text-gray-600">✕</button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input id="e_present" type="checkbox" checked={exportOptions.present} onChange={() => setExportOptions(s => ({ ...s, present: !s.present }))} />
                <label htmlFor="e_present">Present</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="e_absent" type="checkbox" checked={exportOptions.absent} onChange={() => setExportOptions(s => ({ ...s, absent: !s.absent }))} />
                <label htmlFor="e_absent">Absent</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="e_first" type="checkbox" checked={exportOptions.firstTimer} onChange={() => setExportOptions(s => ({ ...s, firstTimer: !s.firstTimer }))} />
                <label htmlFor="e_first">First Timer</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setExportOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button
                onClick={() => {
                  // Build CSV from client data
                  const sessionId = session && (session._id || session.id)
                  if (!sessionId) {
                    alert('No session selected')
                    return
                  }

                  const dateKey = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null)
                  const isFirst = (member) => {
                    if (!member || !member.first_scan_date) return false
                    // A first timer is someone whose first scan date is today (session date)
                    return dateKey(member.first_scan_date) === dateKey(session?.date)
                  }

                  // Build rows from allMembers based on memberStatus (this matches the UI calculation)
                  const presentMembers = allMembers.filter(m => memberStatus[m._id] === 'Present')
                  const absentMembers = allMembers.filter(m => memberStatus[m._id] === 'Absent')

                  let rows = []

                  // Export present records
                  if (exportOptions.present || exportOptions.firstTimer) {
                    let toInclude = presentMembers
                    
                    // Filter to first timers only if specified
                    if (exportOptions.firstTimer) {
                      toInclude = toInclude.filter(m => isFirst(m))
                    }
                    
                    const presentRows = toInclude.map(m => {
                      const first = isFirst(m)
                      return {
                        Name: m.name || '',
                        Email: m.email || '',
                        Phone: m.phone || '',
                        Address: m.address || '',
                        MemberCode: m.memberCode || '',
                        FirstScanDate: m.first_scan_date ? new Date(m.first_scan_date).toISOString() : '',
                        MemberType: first ? 'FirstTimer' : 'Member',
                        AttendanceStatus: 'present',
                        AttendanceTimestamp: m.timestamp ? new Date(m.timestamp).toISOString() : '',
                      }
                    })
                    rows = rows.concat(presentRows)
                  }

                  // Export absent records
                  if (exportOptions.absent) {
                    const absentRows = absentMembers.map(m => ({
                      Name: m.name || '',
                      Email: m.email || '',
                      Phone: m.phone || '',
                      Address: m.address || '',
                      MemberCode: m.memberCode || '',
                      FirstScanDate: m.first_scan_date ? new Date(m.first_scan_date).toISOString() : '',
                      MemberType: 'Member',
                      AttendanceStatus: 'absent',
                      AttendanceTimestamp: '',
                    }))
                    rows = rows.concat(absentRows)
                  }

                  if (rows.length === 0) {
                    alert('No records match the selected options')
                    return
                  }

                  // CSV download
                  const headers = Object.keys(rows[0])
                  const csv = [headers.join(','), ...rows.map(r => headers.map(h => {
                    const v = r[h] == null ? '' : String(r[h]).replace(/"/g, '""')
                    return `"${v}"`
                  }).join(','))].join('\n')

                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                  const link = document.createElement('a')
                  const url = URL.createObjectURL(blob)
                  const sessionName = session?.name || 'session'
                  const sanitized = sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
                  link.setAttribute('href', url)
                  link.setAttribute('download', `${sanitized}-export.csv`)
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)
                  setExportOpen(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-white/10 rounded-2xl p-8 w-full max-w-md text-center border border-stone-200 dark:border-white/10 backdrop-blur-xl">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              Success!
            </h3>
            <p className="text-stone-700 dark:text-gray-200 mb-1">
              <strong>{successMessage.name}</strong>
            </p>
            <p className="text-stone-600 dark:text-gray-400 text-sm mb-4">
              {successMessage.message}
            </p>
            <p className="text-xs text-stone-500 dark:text-gray-500">
              This will close automatically...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
