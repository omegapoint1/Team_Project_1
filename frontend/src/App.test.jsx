// @vitest-environment jsdom

import { render, screen, waitFor, cleanup, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

// Mock all imported pages/components so this test only checks App navbar logic
vi.mock('./pages/LoginPage', () => ({
  default: () => <div>Login Page</div>,
}))

vi.mock('./pages/PlannerPage', () => ({
  default: () => <div>Planner Page</div>,
}))

vi.mock('./pages/SignUpPage', () => ({
  default: () => <div>Sign Up Page</div>,
}))

vi.mock('./pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>,
}))

vi.mock('./pages/Dashboard_Overview', () => ({
  default: () => <div>Overview Page</div>,
}))

vi.mock('./pages/Dashboard_MitigationPlans', () => ({
  default: () => <div>Mitigation Plans Page</div>,
}))

vi.mock('./pages/Dashboard_ScenarioComparison', () => ({
  default: () => <div>Scenario Comparison Page</div>,
}))

vi.mock('./pages/Dashboard_IncidentManagement', () => ({
  default: () => <div>Incident Management Page</div>,
}))

vi.mock('./pages/Dashboard_GenerateReport', () => ({
  default: () => <div>Generate Report Page</div>,
}))

vi.mock('./pages/Dashboard_HotspotAnalytics', () => ({
  default: () => <div>Hotspot Analytics Page</div>,
}))

vi.mock('./pages/FormPage', () => ({
  default: () => <div>Form Page</div>,
}))

vi.mock('./pages/UserDashboard', () => ({
  default: () => <div>User Dashboard</div>,
}))

vi.mock('./components/planner/Scenarios', () => ({
  default: () => <div>Scenario Tab</div>,
}))

vi.mock('./components/planner/MitigationTab', () => ({
  default: () => <div>Mitigation Tab</div>,
}))

vi.mock('./components/planner/Incidents', () => ({
  default: () => <div>Incidents</div>,
}))

vi.mock('./components/planner/Reports', () => ({
  default: () => <div>Reports</div>,
}))

vi.mock('./pages/GamePage', () => ({
  default: () => <div>Game Page</div>,
}))

vi.mock('./pages/TermsPage', () => ({
  default: () => <div>Terms Page</div>,
}))

vi.mock('./pages/ProfilePage', () => ({
  default: () => <div>Profile Page</div>,
}))

vi.mock('./pages/HelpPage.jsx', () => ({
  default: () => <div>Help Page</div>,
}))

describe('App profile icon link', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('links to /login when no user is logged in, then changes to /profile after login', async () => {
    render(<App />)

    const profileIcon = screen.getByText('👤')
    const profileLink = profileIcon.closest('a')

    expect(profileLink).toBeTruthy()
    expect(profileLink.getAttribute('href')).toBe('/login')

    act(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          email: 'user@test.com',
          role: 'user',
        })
      )

      window.dispatchEvent(new Event('userLogin'))
    })

    await waitFor(() => {
      const updatedProfileLink = screen.getByText('👤').closest('a')
      expect(updatedProfileLink).toBeTruthy()
      expect(updatedProfileLink.getAttribute('href')).toBe('/profile')
    })
  })

  it('links to /profile immediately if a user is already in localStorage on load', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        email: 'user@test.com',
        role: 'user',
      })
    )

    render(<App />)

    const profileIcon = screen.getByText('👤')
    const profileLink = profileIcon.closest('a')

    expect(profileLink).toBeTruthy()
    expect(profileLink.getAttribute('href')).toBe('/profile')
  })
})