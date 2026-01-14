import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function AttendPage() {
  const router = useRouter()
  const { sessionId } = router.query
  const [mode, setMode] = useState(null) // 'existing' or 'new'
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [session, setSession] = useState(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || localStorage.getItem('nifes_api') || 'http://localhost:5000'

  useEffect(() => {
    if (sessionId) {
      axios.get(`${apiUrl}/api/sessions/${sessionId}`)
        .then(res => setSession(res.data))
        .catch(err => console.error('Error fetching session:', err))
    }
  }, [sessionId])

  useEffect(() => {
    if (mode === 'existing') {
      fetchMembers()
    }
  }, [mode])

  useEffect(() => {
    if (search.trim()) {
      const filtered = members.filter(m =>
        (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
        (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
      )
      setFilteredMembers(filtered.slice(0, 10)) // limit to 10
    } else {
      setFilteredMembers([])
    }
  }, [search, members])

  async function fetchMembers() {
    try {
      const res = await axios.get(`${apiUrl}/api/members`)
      setMembers(res.data.members || [])
    } catch (err) {
      console.error('Error fetching members')
    }
  }

  async function handleMarkPresent(member) {
    setLoading(true)
    try {
      const res = await axios.post(`${apiUrl}/api/scan`, {
        name: member.name,
        phone: member.phone,
        email: member.email,
        address: member.address,
        sessionId
      })
      setMessage(res.data.message || 'Attendance recorded!')
      setSuccess(true)
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed'
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleNew(e) {
    e.preventDefault()
    if (!name || !email || !phone) return alert('Name, email, and phone required')
    setLoading(true)
    try {
      const res = await axios.post(`${apiUrl}/api/scan`, {
        name,
        phone,
        email,
        address,
        sessionId
      })
      setMessage(res.data.message || 'Registered and marked present!')
      setSuccess(true)
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed'
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) return <div>Loading...</div>

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>
          {session && (
            <div className="mb-4 text-left bg-gray-50 p-3 rounded">
              <p className="font-semibold">Programme: {session.name}</p>
              <p className="text-sm text-gray-600">Created: {new Date(session.createdAt).toLocaleString()}</p>
            </div>
          )}
          <p className="mb-4">Are you an existing member or new?</p>
          <div className="space-y-4">
            <button onClick={() => setMode('existing')} className="w-full bg-blue-600 text-white p-3 rounded font-semibold">
              Existing Member
            </button>
            <button onClick={() => setMode('new')} className="w-full bg-green-600 text-white p-3 rounded font-semibold">
              New Member
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Mark Attendance</h1>
        {session && (
          <div className="mb-4 text-left bg-gray-50 p-3 rounded">
            <p className="font-semibold">Active session: {session.name}</p>
            <p className="text-sm text-gray-600">Created: {new Date(session.createdAt).toLocaleString()}</p>
          </div>
        )}
        {mode === 'existing' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full p-3 border rounded"
              />
              {filteredMembers.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-b shadow-lg max-h-60 overflow-y-auto">
                  {filteredMembers.map(m => (
                    <li
                      key={m._id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => setSelectedMember(m)}
                    >
                      <div className="font-medium">{m.name}</div>
                      <div className="text-sm text-gray-500">{m.email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedMember && (
              <div className="p-3 bg-blue-50 rounded">
                <p><strong>{selectedMember.name}</strong></p>
                <p>{selectedMember.email}</p>
                <button
                  onClick={() => handleMarkPresent(selectedMember)}
                  disabled={loading}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? 'Marking...' : 'Mark Present'}
                </button>
              </div>
            )}
            <button onClick={() => setMode(null)} className="w-full bg-gray-300 text-gray-800 p-2 rounded text-sm">
              Back
            </button>
          </div>
        )}

        {mode === 'new' && (
          <form onSubmit={handleNew} className="space-y-4">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 border rounded"
              required
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border rounded"
              type="email"
              required
            />
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full p-3 border rounded"
              required
            />
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Hostel/Lodge Address"
              className="w-full p-3 border rounded"
            />
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded font-semibold">
              {loading ? 'Registering...' : 'Register & Mark Present'}
            </button>
            <button type="button" onClick={() => setMode(null)} className="w-full bg-gray-300 text-gray-800 p-2 rounded text-sm">
              Back
            </button>
          </form>
        )}

      </div>

      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">Success!</h2>
            <p className="mb-4">{message}</p>
            <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}