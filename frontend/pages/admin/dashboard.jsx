import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isTokenExpired, clearAuthData } from '../../utils/tokenUtils';
import { useSessionExpiration } from '../../hooks/useSessionExpiration';
import SessionTable from '../../components/admin/SessionTable';
import AttendeeTable from '../../components/admin/AttendeeTable';
import AdminManagement from '../../components/admin/AdminManagement';
import DashboardStats from '../../components/admin/DashboardStats';
import Toast from '../../components/Toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { handleSessionExpired } = useSessionExpiration();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.warn('Session expired, logging out...');
        setToast({ type: 'error', message: 'Your session has expired. Please login again.' });
        clearAuthData();
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Only allow superadmin and admin
      if (!['superadmin', 'admin'].includes(parsedUser.role)) {
        router.push('/');
        return;
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      // Load stats
      const statsRes = await fetch(`${apiUrl}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Stats response status:', statsRes.status);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats data:', statsData);
        setStats(statsData);
      } else {
        console.error('Stats fetch failed with status:', statsRes.status);
        const errorText = await statsRes.text();
        console.error('Stats error response:', errorText);
      }

      // Load sessions
      const sessionsRes = await fetch(`${apiUrl}/api/admin/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (sessionsRes.ok) {
        setSessions(await sessionsRes.json());
      }

      // Load attendees
      const attendeesRes = await fetch(`${apiUrl}/api/admin/attendees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (attendeesRes.ok) {
        setAttendees(await attendeesRes.json());
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setToast({ type: 'error', message: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              {user.role === 'superadmin' ? '🔐 Superadmin' : '👤 Admin'} • {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {['overview', 'sessions', 'attendees', 'messaging'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            {user.role === 'superadmin' && (
              <button
                onClick={() => setActiveTab('admin-management')}
                className={`px-1 py-4 font-medium text-sm border-b-2 transition ${
                  activeTab === 'admin-management'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin Management
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <DashboardStats stats={stats} />}
            {activeTab === 'sessions' && <SessionTable sessions={sessions} />}
            {activeTab === 'attendees' && <AttendeeTable attendees={attendees} />}
            {activeTab === 'messaging' && <div className="text-center py-12">
              <p className="text-gray-600">📧 Messaging system coming soon...</p>
            </div>}
            {activeTab === 'admin-management' && <AdminManagement />}
          </>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
