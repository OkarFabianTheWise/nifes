export function getApiUrl() {
  // Read from environment variable or default to localhost
  let raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // If the config value doesn't specify the protocol, default to http
  if (!/^https?:\/\//i.test(raw)) {
    raw = `http://${raw}`;
  }

  // Trim any trailing slash for consistency
  return raw.replace(/\/+$/, '');
}
