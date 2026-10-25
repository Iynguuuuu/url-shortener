import { useState } from 'react'

/**
 * A single short-link row: shows the short URL, original URL,
 * click count, and a copy button.
 */
export default function UrlCard({ item }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(item.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <a
          href={item.shortUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-indigo-600 hover:underline"
        >
          {item.shortUrl}
        </a>
        <p className="truncate text-sm text-slate-500" title={item.originalUrl}>
          {item.originalUrl}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="text-center">
          <span className="block text-lg font-bold text-slate-800">{item.clicks}</span>
          <span className="text-xs text-slate-400">clicks</span>
        </div>
        <button
          onClick={copy}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
