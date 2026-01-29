import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Toast from '../Toast';

export default function SessionTable({ sessions }) {
  const router = useRouter();
  const [expandedSession, setExpandedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleViewDetails = async (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        setSessionDetails(await res.json());
        setExpandedSession(sessionId);
      }
    } catch (error) {
      console.error('Error loading session details:', error);
      setToast({ type: 'error', message: 'Failed to load session details' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewInHome = (sessionId) => {
    router.push({ pathname: '/', query: { sessionId } });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Previous Sessions</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Session Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attendance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No sessions found
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <React.Fragment key={session._id}>
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{session.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {session.attendanceCount || 0} attendees
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {session.is_active ? (
                        <span className="text-green-600 font-medium">🟢 Active</span>
                      ) : (
                        <span className="text-gray-600 font-medium">⚫ Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewInHome(session._id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>

                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
