import { useState } from 'react';
import Toast from '../Toast';
import { getApiUrl } from '../../utils/apiUrl';

export default function AttendeeTable({ attendees }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAttendees, setFilteredAttendees] = useState(attendees);
  const [toast, setToast] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = attendees.filter((attendee) =>
      attendee.name.toLowerCase().includes(query.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(query.toLowerCase()) ||
      attendee.phone?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAttendees(filtered);
  };

  const handleSendMessage = async (attendeeId, attendeeEmail) => {
    const message = prompt('Enter message to send:');
    if (!message) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${getApiUrl()}/api/admin/send-message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ attendeeId, message })
        }
      );

      const data = await res.json();
      if (res.ok) {
        setToast({ type: 'success', message: `Message sent to ${attendeeEmail}` });
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to send message' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ type: 'error', message: 'Failed to send message' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Attendees Directory</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
        />
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">First Scan Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {attendees.length === 0 ? 'No attendees found' : 'No results matching your search'}
                </td>
              </tr>
            ) : (
              filteredAttendees.map((attendee) => (
                <tr key={attendee._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{attendee.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{attendee.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{attendee.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(attendee.first_scan_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleSendMessage(attendee._id, attendee.email)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      💬 Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredAttendees.length} of {attendees.length} attendees
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
