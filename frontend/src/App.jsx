import { useEffect, useState } from 'react'
import { api } from './api/client'
import ShortenForm from './components/ShortenForm'
import UrlCard from './components/UrlCard'

export default function App() {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)

  // Load existing links once when the app mounts.
  useEffect(() => {
    api
      .listUrls()
      .then(setUrls)
      .catch(() => setUrls([]))
      .finally(() => setLoading(false))
  }, [])

  // When a new link is created, drop it on top of the list immediately.
  function handleCreated(created) {
    setUrls((prev) => [created, ...prev])
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Shortly
          </h1>
          <p className="mt-2 text-slate-500">
            Paste a long link, get a short one, track the clicks.
          </p>
        </header>

        <ShortenForm onCreated={handleCreated} />

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Recent links
          </h2>

          {loading ? (
            <p className="text-slate-400">Loading…</p>
          ) : urls.length === 0 ? (
            <p className="text-slate-400">No links yet. Create your first one above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {urls.map((u) => (
                <UrlCard key={u.shortCode} item={u} />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 text-center text-xs text-slate-400">
          Built with React · Spring Boot · MongoDB
        </footer>
      </div>
    </div>
  )
}
