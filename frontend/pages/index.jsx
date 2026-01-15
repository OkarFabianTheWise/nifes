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
  const [searchQuery, setSearchQuery] = useState('')
  const [allMembers, setAllMembers] = useState([])
  const [memberStatus, setMemberStatus] = useState({})
  const [filteredMembers, setFilteredMembers] = useState([])
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    refreshStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, apiUrl])

  useEffect(() => {
    // Filter members based on search query
    if (searchQuery.trim()) {
      setFilteredMembers(
        allMembers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    } else {
      setFilteredMembers([])
    }
  }, [searchQuery, allMembers])

  function handleSessionChange(s) {
    setSession(s)
  }

  async function refreshStats() {
    if (!apiUrl) return
    try {
      // Fetch all members
      const mRes = await axios.get(`${apiUrl}/api/members`)
      const members = mRes.data.members || []
      setAllMembers(members)

      // Fetch current attendance
      const aRes = await axios.get(`${apiUrl}/api/attendance/current`)
      const allAttendance = aRes.data || []

      const sessionId = session && (session._id || session.id)
      const sessionAttendance = sessionId ? allAttendance.filter(r => (r.sessionId && (r.sessionId._id || r.sessionId) === sessionId)) : []
      const presentCount = sessionAttendance.length

      // Build attendance counts for each member
      const memberAttendanceCounts = {}
      const memberSessionAttendance = {}

      allAttendance.forEach(r => {
        const mid = r.memberId && (r.memberId._id || r.memberId)
        if (mid) {
          memberAttendanceCounts[mid] = (memberAttendanceCounts[mid] || 0) + 1
          
          if (sessionId) {
            const rsid = r.sessionId && (r.sessionId._id || r.sessionId)
            if (rsid === sessionId) {
              memberSessionAttendance[mid] = true
            }
          }
        }
      })

      // Determine status for each member
      const statusMap = {}
      members.forEach(m => {
        const mid = m._id
        const count = memberAttendanceCounts[mid] || 0
        
        if (memberSessionAttendance[mid]) {
          statusMap[mid] = 'Present'
        } else if (count === 1) {
          statusMap[mid] = 'First Timer'
        } else if (count > 1) {
          statusMap[mid] = 'Absent'
        } else {
          statusMap[mid] = 'New'
        }
      })

      setMemberStatus(statusMap)

      // First timers: members with exactly one attendance record
      const firstTimersCount = Object.values(memberAttendanceCounts).filter(count => count === 1).length

      const absentCount = members.length - presentCount

      setStats({
        totalMembers: members.length,
        presentToday: presentCount,
        firstTimers: firstTimersCount,
        absent: absentCount
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function markPresent(memberId) {
    if (!apiUrl || !session) return alert('No session')
    const member = allMembers.find(m => m._id === memberId)
    if (!member) return alert('Member not found')
    try {
      await axios.post(`${apiUrl}/api/attendance`, { sessionId: session._id || session.id, email: member.email })
      setSearchQuery('')
      refreshStats()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed'
      alert(msg)
    }
  }

  async function registerMember(name) {
    if (!apiUrl || !session) return alert('No session')
    try {
      await axios.post(`${apiUrl}/api/members`, { sessionId: session._id || session.id, name })
      setSearchQuery('')
      refreshStats()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed'
      alert(msg)
    }
  }

  async function registerAndMarkFromModal(newMemberData) {
    if (!apiUrl || !session) return alert('No session')
    try {
      const response = await axios.post(`${apiUrl}/api/members`, { 
        sessionId: session._id || session.id, 
        ...newMemberData 
      })
      setSearchQuery('')
      setShowRegisterModal(false)
      setSuccessMessage({
        name: newMemberData.name,
        message: response.data.message || 'Member registered and marked present successfully!'
      })
      refreshStats()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed'
      alert(msg)
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
            <h3 className="font-semibold text-lg mb-3">Attendance Actions</h3>
            <p className="text-sm text-gray-600 mb-4">Use the QR code above to scan and mark attendance, or search and register new members.</p>
            
            {/* Search Bar */}
            <div className="flex gap-2 mb-4">
              <input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search member name..." 
                className="flex-1 p-2 border rounded"
              />
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="btn bg-blue-600 text-white"
              >
                Register
              </button>
            </div>

            {/* Search Results */}
            {filteredMembers.length > 0 && (
              <ul className="space-y-2 max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
                {filteredMembers.map(member => {
                  const status = memberStatus[member._id] || 'Registered'
                  return (
                    <li key={member._id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.email || member.phone}</div>
                        <div className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded ${
                          status === 'Present' ? 'bg-green-100 text-green-800' :
                          status === 'First Timer' ? 'bg-blue-100 text-blue-800' :
                          status === 'Absent' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </div>
                      </div>
                      {status !== 'Present' && (
                        <button 
                          onClick={() => markPresent(member._id)} 
                          className="btn bg-green-500 text-white text-sm py-1 px-2 ml-2"
                        >
                          Mark Present
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}

            {/* Register new member if search has text but no match */}
            {searchQuery.trim() && filteredMembers.length === 0 && (
              <div className="border rounded p-3 bg-blue-50 flex items-center justify-between">
                <div>
                  <div className="font-medium">{searchQuery}</div>
                  <div className="text-sm text-gray-600">New member</div>
                </div>
                <button 
                  onClick={() => registerMember(searchQuery)} 
                  className="btn bg-blue-600 text-white text-sm py-1 px-2"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          <SessionManager apiUrl={apiUrl} onSessionChange={handleSessionChange} />
        </div>
      </div>

      <MemberModal open={showModal} onClose={() => setShowModal(false)} apiUrl={apiUrl} sessionId={session && (session._id || session.id)} onMarked={() => refreshStats()} />
      
      {/* Register New Member Modal */}
      {showRegisterModal && (
        <RegisterMemberModal 
          open={showRegisterModal} 
          onClose={() => setShowRegisterModal(false)} 
          onRegister={registerAndMarkFromModal}
        />
      )}

      {/* Success Message Modal */}
      {successMessage && (
        <SuccessModal 
          name={successMessage.name}
          message={successMessage.message}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  )
}

function RegisterMemberModal({ open, onClose, onRegister }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return alert('Name is required')
    if (!phone.trim()) return alert('Phone is required')
    
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
    <div className="modal-backdrop">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Register New Member</h3>
          <button className="text-gray-600" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              type="text"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter full name"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input 
              type="tel"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Enter phone number"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter email"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Enter address"
              rows="3"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-2 mt-4 pt-2 border-t">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn bg-green-600 text-white"
            >
              {loading ? 'Registering...' : 'Register & Mark Present'}
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="btn bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SuccessModal({ name, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="modal-backdrop">
      <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Success!</h3>
        <p className="text-gray-700 mb-1"><strong>{name}</strong></p>
        <p className="text-gray-600 text-sm mb-4">{message}</p>
        <p className="text-xs text-gray-500">This will close automatically...</p>
      </div>
    </div>
  )
}
