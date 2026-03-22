// @vitest-environment jsdom

import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from './ProfilePage'

// This is the first test used to simply check if the test setup is working correctly. 
// It checks if the delete account button is rendered on the profile page when a user is logged in. 
describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()

    localStorage.setItem(
      'user',
      JSON.stringify({
        username: 'victor',
        email: 'victor@test.com',
      })
    )
  })

  it('shows delete account button', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /delete account/i })
    ).toBeTruthy()
  })
})
