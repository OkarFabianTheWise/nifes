import React, { useState, useEffect } from 'react';
import Toast from '../Toast';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.ok) {
        setAdmins(await res.json());
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      setToast({ type: 'error', message: 'Failed to load admins' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (!newAdminEmail) {
      setToast({ type: 'error', message: 'Email is required' });
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/add-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ email: newAdminEmail, name: newAdminName })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setToast({ type: 'success', message: 'Admin added successfully' });
        setNewAdminEmail('');
        setNewAdminName('');
        loadAdmins();
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to add admin' });
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setToast({ type: 'error', message: 'Failed to add admin' });
    }
  };

  const handleRemoveAdmin = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to remove ${userEmail}?`)) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/remove-admin/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      if (res.ok) {
        setToast({ type: 'success', message: 'Admin removed successfully' });
        loadAdmins();
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to remove admin' });
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      setToast({ type: 'error', message: 'Failed to remove admin' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Admins</h2>

      {/* Add New Admin Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Admin</h3>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Admin Name"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Admin
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Default password will be the email address. Admin can change it after first login.
          </p>
        </form>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 p-6 border-b">Current Admins</h3>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{admin.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{admin.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        admin.role === 'superadmin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role === 'superadmin' ? '🔐 Superadmin' : '👤 Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {admin.role !== 'superadmin' ? (
                        <button
                          onClick={() => handleRemoveAdmin(admin._id, admin.email)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
