// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs in a normal user and redirects to /user-dashboard', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: 1,
          email: 'user@test.com',
          role: 'user',
        },
      }),
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await userEvent.type(
      screen.getByPlaceholderText(/enter your email/i),
      'user@test.com'
    )

    await userEvent.type(
      screen.getByPlaceholderText(/enter your password/i),
      'password123'
    )

    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(global.fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'user@test.com',
        password: 'password123',
      }),
    })

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBe(
        JSON.stringify({
          id: 1,
          email: 'user@test.com',
          role: 'user',
        })
      )
    })

    expect(mockNavigate).toHaveBeenCalledWith('/user-dashboard')
  })
})