import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CountUp from 'react-countup'
import Link from 'next/link'

export default function Data() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAttendance: 0,
    totalSessions: 0,
    averageAttendance: 0,
    firstTimersEver: 0,
    recentSessions: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [membersRes, attendanceRes, sessionsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/members`),
        axios.get(`${apiUrl}/api/attendance/current`),
        axios.get(`${apiUrl}/api/sessions`) // Assuming there's a GET /api/sessions for all sessions
      ])

      const members = membersRes.data.members || []
      const attendance = attendanceRes.data || []
      const sessions = sessionsRes.data || [] // Need to check if this route exists

      const totalMembers = members.length
      const totalAttendance = attendance.length
      const totalSessions = sessions.length
      const averageAttendance = totalSessions > 0 ? Math.round(totalAttendance / totalSessions) : 0

      // First timers ever: members with attendance count == 1
      const attendanceCounts = {}
      attendance.forEach(record => {
        const mid = record.memberId?._id || record.memberId
        attendanceCounts[mid] = (attendanceCounts[mid] || 0) + 1
      })
      const firstTimersEver = Object.values(attendanceCounts).filter(count => count === 1).length

      // Recent sessions: last 5 sessions with attendance count
      const recentSessions = sessions.slice(-5).reverse().map(session => {
        const sessionAttendance = attendance.filter(r => (r.sessionId?._id || r.sessionId) === session._id)
        return {
          ...session,
          attendanceCount: sessionAttendance.length
        }
      })

      setStats({
        totalMembers,
        totalAttendance,
        totalSessions,
        averageAttendance,
        firstTimersEver,
        recentSessions
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container">
      <header className="card mb-6 text-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Attendance Data Overview</h1>
        <p className="text-gray-600">Comprehensive stats and insights</p>
        <Link href="/" className="btn mt-2">Back to Dashboard</Link>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card text-center hover:shadow-lg transition-shadow">
          <h3 className="font-semibold mb-2">Total Members</h3>
          <div className="text-3xl font-bold text-indigo-600">
            <CountUp end={stats.totalMembers} duration={2} />
          </div>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow">
          <h3 className="font-semibold mb-2">Total Attendance</h3>
          <div className="text-3xl font-bold text-green-600">
            <CountUp end={stats.totalAttendance} duration={2} />
          </div>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow">
          <h3 className="font-semibold mb-2">Total Sessions</h3>
          <div className="text-3xl font-bold text-purple-600">
            <CountUp end={stats.totalSessions} duration={2} />
          </div>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow">
          <h3 className="font-semibold mb-2">Avg per Session</h3>
          <div className="text-3xl font-bold text-orange-600">
            <CountUp end={stats.averageAttendance} duration={2} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-3">Additional Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>First Timers Ever:</span>
              <span className="font-bold text-blue-600">
                <CountUp end={stats.firstTimersEver} duration={2} />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Return Rate:</span>
              <span className="font-bold text-teal-600">
                {stats.totalMembers > 0 ? Math.round(((stats.totalAttendance - stats.firstTimersEver) / stats.totalMembers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {stats.recentSessions.length > 0 ? (
              stats.recentSessions.map(session => (
                <div key={session._id} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 transition-colors">
                  <span>{session.name}</span>
                  <span className="font-bold text-green-600">{session.attendanceCount}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center p-2 border rounded bg-gray-50">
                <span>Tuesday Service</span>
                <span className="font-bold text-gray-400">0</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}