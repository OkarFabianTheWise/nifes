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

  // --- Export modal state and handlers ---
  const [exportSessionId, setExportSessionId] = useState(null);
  const [exportOptions, setExportOptions] = useState({ present: true, absent: false, firstTimer: false });
  const [exportFormat, setExportFormat] = useState('csv');

  const toggleOption = (key) => {
    setExportOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadCSV = (rows, filename = 'export.csv') => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => {
      const v = r[h] == null ? '' : String(r[h]).replace(/"/g, '""');
      return `"${v}"`;
    }).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (sessionId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/sessions/${sessionId}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        setToast({ type: 'error', message: 'Failed to fetch attendance for export' });
        return;
      }


      const data = await res.json();
      const records = data.records || [];

      // If some records don't have populated member info, fetch all attendees and map them
      const needsFill = records.some(r => !r.memberId || !r.memberId.name);
      let attendeesMap = {};
      if (needsFill) {
        try {
          const atRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendees`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (atRes.ok) {
            const all = await atRes.json();
            attendeesMap = all.reduce((acc, m) => ({ ...acc, [String(m._id)]: m }), {});
          }
        } catch (err) {
          console.warn('Failed to prefetch attendees for export:', err);
        }
      }

      const dateKey = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);
      const isFirstTimer = (member, record) => {
        if (!member || !member.first_scan_date || !record || !record.timestamp) return false;
        return dateKey(member.first_scan_date) === dateKey(record.timestamp);
      };

      // Filter by options
      let filtered = records.filter(r => {
        const statusMatch = (exportOptions.present && r.status === 'present') || (exportOptions.absent && r.status === 'absent');
        if (!exportOptions.present && !exportOptions.absent && !exportOptions.firstTimer) return false;

        // Determine member object (populated or from map)
        let member = r.memberId;
        if (!member || !member.name) {
          const id = member && member._id ? String(member._id) : String(member);
          member = attendeesMap[id] || {};
        }

        const first = isFirstTimer(member, r);

        if (exportOptions.firstTimer && !(first)) return false;

        if (exportOptions.present || exportOptions.absent) {
          if (!statusMatch) return false;
        }

        return true;
      });

      if (filtered.length === 0) {
        setToast({ type: 'info', message: 'No records match selected export options' });
        return;
      }

      // Map to flat rows with full member info and member type
      const rows = filtered.map(r => {
        let m = r.memberId || {};
        if (!m || !m.name) {
          const id = m && m._id ? String(m._id) : String(m);
          m = attendeesMap[id] || {};
        }
        const firstTimerFlag = isFirstTimer(m, r);
        return {
          Name: m.name || '',
          Email: m.email || '',
          Phone: m.phone || '',
          Address: m.address || '',
          MemberCode: m.memberCode || '',
          FirstScanDate: m.first_scan_date ? new Date(m.first_scan_date).toISOString() : '',
          MemberType: firstTimerFlag ? 'FirstTimer' : 'Member',
          AttendanceStatus: r.status || '',
          AttendanceTimestamp: r.timestamp ? new Date(r.timestamp).toISOString() : '',
        };
      });

      const sessionName = sessions?.find(s => s._id === sessionId)?.name || 'session';
      const sanitized = sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${sanitized}-export.csv`;
      downloadCSV(rows, filename);
      setToast({ type: 'success', message: 'Export started' });
      setExportSessionId(null);
    } catch (error) {
      console.error('Export error', error);
      setToast({ type: 'error', message: 'Export failed' });
    } finally {
      setLoading(false);
    }
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
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleViewInHome(session._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setExportSessionId(session._id)}
                          title="Export session data"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          📤
                        </button>
                      </div>
                    </td>
                  </tr>

                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {exportSessionId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Export Session</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input id="present" type="checkbox" checked={exportOptions.present} onChange={() => toggleOption('present')} />
                <label htmlFor="present" className="ml-2">Present</label>
              </div>
              <div className="flex items-center">
                <input id="absent" type="checkbox" checked={exportOptions.absent} onChange={() => toggleOption('absent')} />
                <label htmlFor="absent" className="ml-2">Absent</label>
              </div>
              <div className="flex items-center">
                <input id="firstTimer" type="checkbox" checked={exportOptions.firstTimer} onChange={() => toggleOption('firstTimer')} />
                <label htmlFor="firstTimer" className="ml-2">First Timer</label>
              </div>
              <div className="pt-2">
                <div className="text-sm font-medium mb-1">Format</div>
                <label className="mr-3"><input type="radio" name="format" checked={exportFormat === 'csv'} onChange={() => setExportFormat('csv')} /> CSV</label>
                <label><input type="radio" name="format" disabled={true} checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')} /> PDF (coming)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setExportSessionId(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => handleExport(exportSessionId)} className="px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
