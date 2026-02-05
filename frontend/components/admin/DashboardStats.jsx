// import React from 'react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Toast from '../Toast';

export default function DashboardStats({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  const router = useRouter();

  const [exportOpen, setExportOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({ present: true, absent: false, firstTimer: false });
  const [exportSource, setExportSource] = useState(stats?.activeSessionId ? 'session' : 'all');
  const [toast, setToast] = useState(null);

  const toggleOption = (k) => setExportOptions(s => ({ ...s, [k]: !s[k] }));

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

  const dateKey = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);
  const isFirstTimer = (member, record) => {
    if (!member || !member.first_scan_date || !record || !record.timestamp) return false;
    return dateKey(member.first_scan_date) === dateKey(record.timestamp);
  };

  const handleDashboardExport = async () => {
    setExportOpen(false);
    const token = localStorage.getItem('token');
    try {
      if (exportSource === 'all') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendees`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setToast({ type: 'error', message: 'Failed to fetch members' }); return; }
        const members = await res.json();
        const rows = members.map(m => ({
          Name: m.name || '', Email: m.email || '', Phone: m.phone || '', Address: m.address || '', MemberCode: m.memberCode || '', FirstScanDate: m.first_scan_date ? new Date(m.first_scan_date).toISOString() : '', MemberType: 'Member'
        }));
        downloadCSV(rows, 'members-export.csv');
        setToast({ type: 'success', message: 'Members export started' });
        return;
      }

      // session export
      const sessionId = stats?.activeSessionId;
      if (!sessionId) { setToast({ type: 'error', message: 'No active session selected' }); return; }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/sessions/${sessionId}/attendance`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { setToast({ type: 'error', message: 'Failed to fetch session attendance' }); return; }
      const data = await res.json();
      const records = data.records || [];

      let filtered = records.filter(r => {
        const statusMatch = (exportOptions.present && r.status === 'present') || (exportOptions.absent && r.status === 'absent');
        if (!exportOptions.present && !exportOptions.absent && !exportOptions.firstTimer) return false;

        // member may be populated
        const m = r.memberId || {};
        const first = isFirstTimer(m, r);
        if (exportOptions.firstTimer && !first) return false;
        if ((exportOptions.present || exportOptions.absent) && !statusMatch) return false;
        return true;
      });

      if (filtered.length === 0) { setToast({ type: 'info', message: 'No records match selected options' }); return; }

      const rows = filtered.map(r => {
        const m = r.memberId || {};
        const first = isFirstTimer(m, r);
        return {
          Name: m.name || '', Email: m.email || '', Phone: m.phone || '', Address: m.address || '', MemberCode: m.memberCode || '', FirstScanDate: m.first_scan_date ? new Date(m.first_scan_date).toISOString() : '', MemberType: first ? 'FirstTimer' : 'Member', AttendanceStatus: r.status || '', AttendanceTimestamp: r.timestamp ? new Date(r.timestamp).toISOString() : ''
        };
      });

      const sessionName = stats?.activeSessionId ? 'active_session' : 'session';
      const sanitized = sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      downloadCSV(rows, `${sanitized}-export.csv`);
      setToast({ type: 'success', message: 'Export started' });
    } catch (err) {
      console.error('Dashboard export error', err);
      setToast({ type: 'error', message: 'Export failed' });
    }
  };

  const statCards = [
    { label: 'Total Sessions', value: stats.totalSessions, icon: '📅', color: 'blue', clickable: true, target: { view: 'sessions' } },
    { label: 'Active Sessions', value: stats.activeSessions, icon: '🟢', color: 'green', clickable: true, target: { sessionId: stats.activeSessionId || null, view: stats.activeSessionId ? null : 'active' } },
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', color: 'purple' },
    { label: 'Total Attendance', value: stats.totalAttendance, icon: '✅', color: 'orange' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <div>
          <button onClick={() => setExportOpen(true)} className="text-sm text-gray-600 hover:text-gray-900">Export</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            role={card.clickable ? 'button' : undefined}
            onClick={card.clickable ? () => {
              if (card.target) {
                const { sessionId, view } = card.target;
                if (sessionId) {
                  router.push({ pathname: '/', query: { sessionId } });
                } else if (view) {
                  router.push({ pathname: '/', query: { view } });
                } else {
                  router.push('/');
                }
              } else {
                router.push('/');
              }
            } : undefined}
            className={`bg-white rounded-lg shadow p-6 transition ${card.clickable ? 'hover:shadow-lg cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{card.icon}</span>
                {card.clickable && card.target && card.target.sessionId && (
                  <button title="Export this session" onClick={() => { setExportSource('session'); setExportOpen(true); }} className="text-gray-600">📤</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {exportOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>
            <div className="mb-3">
              <label className="block font-medium">Source</label>
              <select value={exportSource} onChange={(e) => setExportSource(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
                <option value="session">Active Session</option>
                <option value="all">All Members</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="d_present" type="checkbox" checked={exportOptions.present} onChange={() => toggleOption('present')} />
                <label htmlFor="d_present" className="ml-2">Present</label>
              </div>
              <div className="flex items-center">
                <input id="d_absent" type="checkbox" checked={exportOptions.absent} onChange={() => toggleOption('absent')} />
                <label htmlFor="d_absent" className="ml-2">Absent</label>
              </div>
              <div className="flex items-center">
                <input id="d_first" type="checkbox" checked={exportOptions.firstTimer} onChange={() => toggleOption('firstTimer')} />
                <label htmlFor="d_first" className="ml-2">First Timer</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setExportOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => handleDashboardExport()} className="px-4 py-2 bg-blue-600 text-white rounded">Export</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
