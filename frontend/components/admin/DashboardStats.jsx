import React from 'react';
import { useRouter } from 'next/router';

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

  const statCards = [
    { label: 'Total Sessions', value: stats.totalSessions, icon: '📅', color: 'blue', clickable: true, target: { view: 'sessions' } },
    { label: 'Active Sessions', value: stats.activeSessions, icon: '🟢', color: 'green', clickable: true, target: { sessionId: stats.activeSessionId || null, view: stats.activeSessionId ? null : 'active' } },
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', color: 'purple' },
    { label: 'Total Attendance', value: stats.totalAttendance, icon: '✅', color: 'orange' }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
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
              <span className="text-4xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
