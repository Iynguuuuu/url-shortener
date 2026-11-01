import { useState } from 'react'
import { api } from '../api/client'

/**
 * The input + button that creates a short link, then hands the result up
 * to the parent so it can drop into the list.
 */
export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const created = await api.shorten(url.trim())
      setUrl('')
      onCreated(created)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a long link to shrink it"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-iris-500 focus:ring-4 focus:ring-iris-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-iris-600 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-iris-700 focus:ring-4 focus:ring-iris-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Shortening' : 'Shorten'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}
