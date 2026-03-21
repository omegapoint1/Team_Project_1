// @vitest-environment jsdom

import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './Dashboard'

afterEach(() => {
  cleanup()
})

// This test suite checks that the DashboardPage component renders the correct navigation tabs with the correct hrefs, and that it properly renders content passed through the Outlet.
describe('DashboardPage', () => {
  it('renders all dashboard navigation tabs', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/overview']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="overview" element={<div>Overview Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /overview/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /mitigation plans/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /scenario comparison/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /incident management/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /generate report/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /hotspot analytics/i })).toBeTruthy()
  })

  it('renders the correct href for each dashboard tab', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/overview']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="overview" element={<div>Overview Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /overview/i }).getAttribute('href')
    ).toBe('/dashboard/overview')

    expect(
      screen.getByRole('link', { name: /mitigation plans/i }).getAttribute('href')
    ).toBe('/dashboard/mitigation')

    expect(
      screen.getByRole('link', { name: /scenario comparison/i }).getAttribute('href')
    ).toBe('/dashboard/comparison')

    expect(
      screen.getByRole('link', { name: /incident management/i }).getAttribute('href')
    ).toBe('/dashboard/tracker')

    expect(
      screen.getByRole('link', { name: /generate report/i }).getAttribute('href')
    ).toBe('/report')

    expect(
      screen.getByRole('link', { name: /hotspot analytics/i }).getAttribute('href')
    ).toBe('/dashboard/hotspots')
  })

  it('renders outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/overview']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="overview" element={<div>Overview Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getAllByText('Overview Content').length).toBe(1)
  })
})