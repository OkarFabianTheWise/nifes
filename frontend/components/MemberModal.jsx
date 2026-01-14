import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function MemberModal({ open, onClose, apiUrl, sessionId, onMarked }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [members, setMembers] = useState([])
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    if (!open) {
      setEmail('')
      setName('')
      setPhone('')
      setQuery('')
      setMembers([])
      setFiltered([])
    } else {
      fetchMembers()
    }
  }, [open])

  useEffect(() => {
    if (query.trim()) {
      setFiltered(members.filter(m => m.name.toLowerCase().includes(query.toLowerCase())))
    } else {
      setFiltered([])
    }
  }, [query, members])

  async function fetchMembers() {
    if (!apiUrl) return
    try {
      const res = await axios.get(`${apiUrl}/api/members`)
      setMembers(res.data.members || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function markPresent(memberId) {
    if (!apiUrl || !sessionId) return alert('No session')
    setLoading(true)
    try {
      await axios.post(`${apiUrl}/api/attendance`, { sessionId, email: members.find(m => m._id === memberId)?.email })
      onMarked && onMarked()
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  async function markByEmail() {
    if (!apiUrl || !sessionId) return alert('Missing API or session')
    if (!email) return alert('Email is required to mark by email')
    setLoading(true)
    try {
      const res = await axios.post(`${apiUrl}/api/attendance`, { sessionId, email, name, phone })
      alert(res.data.message || 'Marked present')
      onMarked && onMarked()
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  async function registerAndMark() {
    if (!apiUrl || !sessionId) return alert('Missing API or session')
    if (!name) return alert('Name is required')
    setLoading(true)
    try {
      const res = await axios.post(`${apiUrl}/api/members`, { sessionId, name, email, phone })
      alert(res.data.message || 'Registered and marked')
      onMarked && onMarked()
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-backdrop">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Mark / Register</h3>
          <button className="text-gray-600" onClick={onClose}>✕</button>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name..." className="flex-1 p-2 border rounded" />
            <button onClick={() => {}} className="btn">Search</button>
          </div>
          <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto">
            {filtered.map(r => (
              <li key={r._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-gray-500">{r.email || r.phone}</div>
                </div>
                <button onClick={() => markPresent(r._id)} className="btn bg-green-500">Mark Present</button>
              </li>
            ))}
          </ul>
        </div>

        <hr />

        <div className="mt-4">
          <div className="grid grid-cols-1 gap-2">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (for quick mark)" className="p-2 border rounded" />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name (for registration)" className="p-2 border rounded" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="p-2 border rounded" />
            <div className="flex gap-2 mt-2">
              <button onClick={markByEmail} disabled={loading} className="btn bg-green-600">{loading ? 'Working...' : 'Mark by Email'}</button>
              <button onClick={registerAndMark} disabled={loading} className="btn bg-blue-600">{loading ? 'Working...' : 'Register & Mark'}</button>
              <button onClick={onClose} className="btn bg-gray-300 text-gray-800">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
