// A tiny API wrapper around fetch(). All backend calls go through here,
// so there's one place to change the base URL or add error handling.

// In dev this is empty and Vite proxies /api to :8080 (see vite proxy note),
// but simplest is to point straight at the backend via an env var.
// VITE_API_URL is baked in at build time.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    // Try to read the backend's JSON error message; fall back to status text.
    let message = res.statusText
    try {
      const body = await res.json()
      message = body.message || message
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }

  return res.json()
}

export const api = {
  // Create a short link
  shorten: (url) =>
    request('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),

  // Get all links (newest first)
  listUrls: () => request('/api/urls'),
}

export { BASE as API_BASE }
