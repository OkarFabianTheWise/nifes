// index.jsx
import React, { useEffect, useState } from 'react'
import SessionManager from '../components/SessionManager'
import QRCodeCard from '../components/QRCodeCard'
import MemberModal from '../components/MemberModal'
import axios from 'axios'
import Link from 'next/link'

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
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Fellowship Attendance Dashboard</h1>
        <p className="text-gray-600">Manage attendance with QR and manual registration</p>
        <Link href="/data" className="btn mt-2">View Data & Stats</Link>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="card mb-4">
            <h3 className="font-semibold mb-3">Quick Stats.</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="border p-3 rounded">Total Members: <strong>{stats.totalMembers}</strong></div>
              <div className="border p-3 rounded">Present Today: <strong>{stats.presentToday}</strong></div>
              <div className="border p-3 rounded">First Timers: <strong>{stats.firstTimers}</strong></div>
              <div className="border p-3 rounded">Absent: <strong>{stats.absent}</strong></div>
            </div>
          </div>

          <SessionManager apiUrl={apiUrl} onSessionChange={handleSessionChange} />
        </div>

        <div className="md:col-span-2">
          <QRCodeCard session={session} fallbackApiUrl={apiUrl} />
          <div className="mt-4 card">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Attendance Actions</h3>
              <div className="flex gap-2">
                <button className="btn" onClick={() => setShowModal(true)}>Manual Mark / Register</button>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Use the QR above to scan and mark attendance (scans should call the backend scan endpoint).</p>
          </div>
        </div>
      </div>

      <MemberModal open={showModal} onClose={() => setShowModal(false)} apiUrl={apiUrl} sessionId={session && (session._id || session.id)} onMarked={() => refreshStats()} />
    </div>
  )
}
