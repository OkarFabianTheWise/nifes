// components/SessionManager.jsx 
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SessionManager({ apiUrl, onSessionChange }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sessionName, setSessionName] = useState('')

  useEffect(() => {
    if (!apiUrl) return
    fetchActive()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl])

  async function fetchActive() {
    try {
      const res = await axios.get(`${apiUrl}/api/sessions/active`)
      if (res.data) {
        setSession(res.data.session || res.data)
        onSessionChange && onSessionChange(res.data.session || res.data)
      }
    } catch (err) {
      // ignore
      console.error(err)
    }
  }

  async function createSession() {
    if (!apiUrl || !sessionName.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${apiUrl}/api/sessions`, { name: sessionName.trim() })
      const s = res.data.session || res.data
      setSession(s)
      onSessionChange && onSessionChange(s)
      setShowModal(false)
      setSessionName('')
    } catch (err) {
      console.error(err)
      const msg = err?.response?.data?.error || err.message || 'Failed to create session'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Session Management</h3>
      {session ? (
        <div>
          <p>Active session: <strong>{session.name || session._id || session.id || '—'}</strong></p>
          <p className="text-sm text-gray-600">Created: {new Date(session.createdAt || Date.now()).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-gray-500">No active session</p>
      )}

      <div className="mt-4 flex gap-3">
        <button onClick={() => setShowModal(true)} className="btn">Create New Session</button>
        <button onClick={fetchActive} className="btn bg-green-500">Refresh</button>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Session</h3>
              <button className="text-gray-600" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="mb-4">
              <input
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Session name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createSession} disabled={loading} className="btn">{loading ? 'Creating...' : 'Create'}</button>
              <button onClick={() => setShowModal(false)} className="btn bg-gray-300 text-gray-800">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
