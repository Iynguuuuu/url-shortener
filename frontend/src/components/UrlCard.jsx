import { useState } from 'react'

// Turns an ISO timestamp into "3 hours ago". Returns null if absent/invalid
// so the card simply omits the line (e.g. in tests where createdAt is unset).
function timeAgo(iso) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  const seconds = Math.round((Date.now() - then) / 1000)
  const steps = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, size] of steps) {
    const value = Math.floor(seconds / size)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

/**
 * One short-link row: the short URL, the destination, a live click count,
 * plus copy and QR actions.
 */
export default function UrlCard({ item }) {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(item.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked — ignore
    }
  }

  const created = timeAgo(item.createdAt)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    item.shortUrl,
  )}`

  return (
    <div className="animate-rise-in rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-iris-400 hover:shadow-lg hover:shadow-iris-500/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-iris-500">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={item.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display text-lg font-semibold text-iris-600 hover:underline dark:text-iris-400"
          >
            {item.shortUrl}
          </a>
          <p
            className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400"
            title={item.originalUrl}
          >
            {item.originalUrl}
          </p>
          {created && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Created {created}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="text-right">
            <span className="block font-display text-2xl font-bold leading-none text-slate-800 dark:text-slate-100">
              {item.clicks}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr((v) => !v)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {showQr ? 'Hide QR' : 'QR'}
            </button>
            <button
              onClick={copy}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {showQr && (
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <img
            src={qrSrc}
            alt={`QR code for ${item.shortUrl}`}
            width={96}
            height={96}
            className="rounded-lg border border-slate-200 bg-white dark:border-slate-700"
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>Scan to open the short link.</p>
            <a
              href={qrSrc}
              download={`${item.shortCode}-qr.png`}
              className="mt-1 inline-block font-medium text-iris-600 hover:underline dark:text-iris-400"
            >
              Download PNG
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
