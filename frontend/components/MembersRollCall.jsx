import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function MembersRollCall({ apiUrl, currentSession, stats, refreshStats }) {
  const [members, setMembers] = useState([])
  const [memberStatus, setMemberStatus] = useState({})
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    fetchMembersWithStatus()
  }, [apiUrl, currentSession, stats])

  async function fetchMembersWithStatus() {
    try {
      const mRes = await axios.get(`${apiUrl}/api/members`)
      const allMembers = mRes.data.members || []

      const aRes = await axios.get(`${apiUrl}/api/attendance/current`)
      const allAttendance = aRes.data || []

      // Build attendance counts
      const memberAttendanceCounts = {}
      const memberSessionAttendance = {}

      allAttendance.forEach(r => {
        const mid = r.memberId && (r.memberId._id || r.memberId)
        if (mid) {
          memberAttendanceCounts[mid] = (memberAttendanceCounts[mid] || 0) + 1
          
          const sid = currentSession && (currentSession._id || currentSession.id)
          const rsid = r.sessionId && (r.sessionId._id || r.sessionId)
          if (sid && rsid === sid) {
            memberSessionAttendance[mid] = true
          }
        }
      })

      // Determine status for each member
      const statusMap = {}
      allMembers.forEach(m => {
        const mid = m._id
        const count = memberAttendanceCounts[mid] || 0
        
        if (memberSessionAttendance[mid]) {
          statusMap[mid] = 'Present'
        } else if (count === 1) {
          statusMap[mid] = 'First Timer'
        } else if (count > 0) {
          statusMap[mid] = 'Absent'
        } else {
          statusMap[mid] = 'New'
        }
      })

      setMembers(allMembers)
      setMemberStatus(statusMap)
    } catch (err) {
      console.error('Error fetching members with status:', err)
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800'
      case 'First Timer':
        return 'bg-blue-100 text-blue-800'
      case 'Absent':
        return 'bg-orange-100 text-orange-800'
      case 'New':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Duplicate members for seamless looping
  const displayMembers = members.length > 0 ? [...members, ...members] : []

  return (
    <div className="card mb-4">
      <h3 className="font-semibold mb-3">Members Roll Call</h3>
      
      <style>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .roll-call-container {
          position: relative;
          height: 300px;
          overflow: hidden;
          border-radius: 0.5rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.95), rgba(255,255,255,0.3));
        }

        .roll-call-list {
          display: flex;
          flex-direction: column;
          animation: scrollUp 120s linear infinite;
        }

        .roll-call-container:hover .roll-call-list {
          animation-play-state: paused;
        }

        .roll-call-item {
          min-height: 60px;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
        }

        .roll-call-item:last-child {
          border-bottom: none;
        }

        .roll-call-name {
          font-weight: 500;
          color: #1f2937;
          flex: 1;
        }

        .roll-call-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          white-space: nowrap;
          margin-left: 0.5rem;
        }
      `}</style>

      <div
        className="roll-call-container border border-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {displayMembers.length > 0 ? (
          <div className="roll-call-list">
            {displayMembers.map((member, index) => {
              const status = memberStatus[member._id] || 'Registered'
              return (
                <div key={`${member._id}-${index}`} className="roll-call-item">
                  <div className="roll-call-name">{member.name || 'Unknown'}</div>
                  <span className={`roll-call-badge ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No members registered yet</p>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">Hover to pause scrolling</p>
    </div>
  )
}
