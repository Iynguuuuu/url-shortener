import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client";
import ShortenForm from "./components/ShortenForm";
import UrlCard from "./components/UrlCard";

export default function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  // Apply the theme to <html> and remember the choice per browser.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // storage blocked — ignore
    }
  }, [dark]);

  // Load existing links once on mount.
  useEffect(() => {
    api
      .listUrls()
      .then(setUrls)
      .catch(() => setUrls([]))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(created) {
    setUrls((prev) => [created, ...prev]);
  }

  const totalClicks = useMemo(
    () => urls.reduce((sum, u) => sum + (u.clicks || 0), 0),
    [urls],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return urls;
    return urls.filter(
      (u) =>
        u.originalUrl.toLowerCase().includes(q) ||
        u.shortUrl.toLowerCase().includes(q),
    );
  }, [urls, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* soft iris glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-iris-500/10 to-transparent dark:from-iris-500/15"
      />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-iris-600 font-display text-lg font-bold text-white">
              S
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              Shortly
            </span>
          </div>
          <button
            onClick={() => setDark((v) => !v)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        <header className="mb-8">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Long links in,
            <br />
            short links out.
          </h1>
          <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
            Shrink any URL, share it anywhere, and watch the clicks add up in
            real time.
          </p>
        </header>

        <ShortenForm onCreated={handleCreated} />

        {/* stat tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-display text-3xl font-bold">{urls.length}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              links created
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="font-display text-3xl font-bold text-iris-600 dark:text-iris-400">
              {totalClicks}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              total clicks
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Your links</h2>
            {urls.length > 0 && (
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search links"
                className="w-40 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-iris-500 focus:ring-2 focus:ring-iris-500/15 dark:border-slate-700 dark:bg-slate-900 sm:w-52"
              />
            )}
          </div>

          {loading ? (
            <p className="text-slate-400">Loading your links…</p>
          ) : urls.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No links yet. Paste one above to create your first short link.
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400">No links match that search.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((u) => (
                <UrlCard key={u.shortCode} item={u} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
