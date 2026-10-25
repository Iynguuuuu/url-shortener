import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UrlCard from './UrlCard'

// A small render test. CI runs `npm test` which runs this.
describe('UrlCard', () => {
  const item = {
    shortCode: 'abc123',
    shortUrl: 'http://localhost:8080/abc123',
    originalUrl: 'https://example.com/a/very/long/path',
    clicks: 42,
  }

  it('shows the short url, original url and click count', () => {
    render(<UrlCard item={item} />)

    expect(screen.getByText('http://localhost:8080/abc123')).toBeInTheDocument()
    expect(screen.getByText('https://example.com/a/very/long/path')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
