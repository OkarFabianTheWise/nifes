// attend/[sessionId].jsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Logo Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20">
            <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="absolute top-1/3 right-20 w-24 h-24">
            <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28">
            <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="absolute bottom-10 right-10 w-20 h-20">
            <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 w-full max-w-md text-center relative z-10 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 relative">
              <Image src="/nifes-logo.png" alt="NIFES Logo" fill className="object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>
          {session && (
            <div className="mb-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 mt-0.5 flex-shrink-0 relative">
                  <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">Programme: {session.name}</p>
                  <p className="text-xs text-indigo-600 mt-1">Created: {new Date(session.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <p className="mb-6 text-gray-700">Are you an existing member or new?</p>
          <div className="space-y-3">
            <button onClick={() => setMode('existing')} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition">
              Existing Member
            </button>
            <button onClick={() => setMode('new')} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition">
              New Member
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Logo Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20">
          <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="absolute top-1/3 right-20 w-24 h-24">
          <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28">
          <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="absolute bottom-10 right-10 w-20 h-20">
          <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 w-full max-w-md relative z-10 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 relative">
            <Image src="/nifes-logo.png" alt="NIFES Logo" fill className="object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Mark Attendance</h1>
        {session && (
          <div className="mb-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0 relative">
                <Image src="/nifes-logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <p className="font-semibold text-indigo-900">Active session: {session.name}</p>
                <p className="text-xs text-indigo-600 mt-1">Created: {new Date(session.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
        {mode === 'existing' && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 w-4 h-4 relative">
                <Image src="/nifes-logo.png" alt="Search" fill className="object-contain opacity-50" />
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full p-3 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {filteredMembers.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-indigo-200 rounded-b-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredMembers.map(m => (
                    <li
                      key={m._id}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 transition"
                      onClick={() => setSelectedMember(m)}
                    >
                      <div className="font-medium text-gray-800">{m.name}</div>
                      <div className="text-sm text-gray-500">{m.email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedMember && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0 relative">
                    <Image src="/nifes-logo.png" alt="Member" fill className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <p><strong className="text-indigo-900">{selectedMember.name}</strong></p>
                    <p className="text-sm text-gray-600">{selectedMember.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkPresent(selectedMember)}
                  disabled={loading}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Marking...' : 'Mark Present'}
                </button>
              </div>
            )}
            <button onClick={() => setMode(null)} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-lg text-sm font-medium transition">
              Back
            </button>
          </div>
        )}

        {mode === 'new' && (
          <form onSubmit={handleNew} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 w-4 h-4 relative">
                <Image src="/nifes-logo.png" alt="Name" fill className="object-contain opacity-50" />
              </div>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-3 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 w-4 h-4 relative">
                <Image src="/nifes-logo.png" alt="Email" fill className="object-contain opacity-50" />
              </div>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="email"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 w-4 h-4 relative">
                <Image src="/nifes-logo.png" alt="Phone" fill className="object-contain opacity-50" />
              </div>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full p-3 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-3 w-4 h-4 relative">
                <Image src="/nifes-logo.png" alt="Address" fill className="object-contain opacity-50" />
              </div>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Hostel/Lodge Address"
                className="w-full p-3 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
              {loading ? 'Registering...' : 'Register & Mark Present'}
            </button>
            <button type="button" onClick={() => setMode(null)} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-lg text-sm font-medium transition">
              Back
            </button>
          </form>
        )}

      </div>

      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 relative">
          <div className="bg-white p-8 rounded-xl text-center shadow-2xl w-full max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 relative">
                <Image src="/nifes-logo.png" alt="Success" fill className="object-contain" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
            <p className="mb-6 text-gray-700">{message}</p>
            <button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}