import React from 'react'
import QRCode from 'react-qr-code'

export default function QRCodeCard({ session, fallbackApiUrl }) {
  if (!session) return (
    <div className="card text-center">
      <p className="text-gray-500">No QR to show. Create a session first.</p>
    </div>
  )

  // prefer backend-generated image if available
  const img = session.qrCodeImage || session.qrCode || null
  const qrData = session.qrData || (fallbackApiUrl && `${fallbackApiUrl}/api/scan?session=${session._id || session.id}`)

  return (
    <div className="card text-center">
      <h3 className="text-lg font-semibold mb-4">Scan to mark attendance</h3>
      <div className="mx-auto inline-block bg-white p-4 rounded-md">
        {img ? (
          <img src={img} alt="session qr" style={{ width: 200, height: 200 }} />
        ) : (
          <QRCode value={qrData || ''} size={180} />
        )}
      </div>
      <p className="mt-3 text-sm text-gray-600 break-all">{qrData}</p>
    </div>
  )
}
