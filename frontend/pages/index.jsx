// index.jsx
import React, { useEffect, useState } from 'react'
import SessionManager from '../components/SessionManager'
import QRCodeCard from '../components/QRCodeCard'
import MemberModal from '../components/MemberModal'
import MembersRollCall from '../components/MembersRollCall'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const [session, setSession] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({ totalMembers: '-', presentToday: '-', firstTimers: '-' })

  useEffect(() => {
    refreshStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, apiUrl])

  function handleSessionChange(s) {
    setSession(s)
  }

  async function refreshStats() {
    if (!apiUrl) return
    try {
      // Fetch all members
      const mRes = await axios.get(`${apiUrl}/api/members`)
      const allMembers = mRes.data.members || []

      // Fetch current attendance
      const aRes = await axios.get(`${apiUrl}/api/attendance/current`)
      const allAttendance = aRes.data || []

      const sessionId = session && (session._id || session.id)
      const sessionAttendance = sessionId ? allAttendance.filter(r => (r.sessionId && (r.sessionId._id || r.sessionId) === sessionId)) : []
      const presentCount = sessionAttendance.length

      // First timers: members with only one attendance record ever
      const memberAttendanceCounts = {}
      allAttendance.forEach(r => {
        const mid = r.memberId && (r.memberId._id || r.memberId)
        if (mid) memberAttendanceCounts[mid] = (memberAttendanceCounts[mid] || 0) + 1
      })
      const firstTimers = Object.values(memberAttendanceCounts).filter(count => count === 1).length

      const absentCount = allMembers.length - presentCount

      setStats({
        totalMembers: allMembers.length,
        presentToday: presentCount,
        firstTimers,
        absent: absentCount
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container">
      <header className="card mb-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 relative">
            <Image src="/nifes-logo.png" alt="NIFES Logo" fill className="object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Fellowship Attendance Dashboard</h1>
        <p className="text-gray-600">Manage attendance with QR and manual registration</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Stats */}
        <div>
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">Quick Stats</h3>
              <Link href="/data" className="btn text-xs py-1 px-2">View Data</Link>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="border p-3 rounded bg-gradient-to-r from-blue-50 to-transparent">Total Members: <strong>{stats.totalMembers}</strong></div>
              <div className="border p-3 rounded bg-gradient-to-r from-green-50 to-transparent">Present Today: <strong>{stats.presentToday}</strong></div>
              <div className="border p-3 rounded bg-gradient-to-r from-purple-50 to-transparent">First Timers: <strong>{stats.firstTimers}</strong></div>
              <div className="border p-3 rounded bg-gradient-to-r from-orange-50 to-transparent">Absent: <strong>{stats.absent}</strong></div>
            </div>
          </div>
        </div>

        {/* Right Column: QR Code */}
        <div>
          <QRCodeCard session={session} fallbackApiUrl={apiUrl} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Left Column: Members Roll Call */}
        <div>
          <MembersRollCall apiUrl={apiUrl} currentSession={session} stats={stats} refreshStats={refreshStats} />
        </div>

        {/* Right Column: Attendance Actions & Session Manager stacked */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Attendance Actions</h3>
              <button className="btn" onClick={() => setShowModal(true)}>
                Manual Mark / Register
              </button>
            </div>
            <p className="text-sm text-gray-600">Use the QR code above to scan and mark attendance, or manually register new members.</p>
          </div>

          <SessionManager apiUrl={apiUrl} onSessionChange={handleSessionChange} />
        </div>
      </div>

      <MemberModal open={showModal} onClose={() => setShowModal(false)} apiUrl={apiUrl} sessionId={session && (session._id || session.id)} onMarked={() => refreshStats()} />
    </div>
  )
}
