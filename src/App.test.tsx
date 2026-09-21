import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function mockFetchSequence(
  handlers: Array<(url: string, init?: RequestInit) => Promise<Partial<Response> & { json: () => Promise<unknown> }>>,
) {
  let i = 0
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const handler = handlers[i++]
      if (!handler) throw new Error(`unexpected fetch: ${url}`)
      const partial = await handler(url, init)
      return {
        ok: partial.ok ?? true,
        status: partial.status ?? 200,
        json: partial.json,
      }
    }),
  )
}

describe('App login flow', () => {
  it('login success shows /me profile and short token', async () => {
    const user = userEvent.setup()
    mockFetchSequence([
      async () => ({
        ok: true,
        json: async () => ({
          accessToken: 'aaaaaaaaaaaabbbbbbbbbbbbcccccccc',
          tokenType: 'Bearer',
          expiresInMs: 3600000,
        }),
      }),
      async () => ({
        ok: true,
        json: async () => ({ username: 'demo', displayName: 'Demo User' }),
      }),
    ])

    render(<App />)
    await user.type(screen.getByLabelText('用户名'), 'demo')
    await user.type(screen.getByLabelText('密码'), 'demo123')
    await user.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(screen.getByTestId('me-username')).toHaveTextContent('demo')
    })
    expect(screen.getByTestId('me-displayName')).toHaveTextContent('Demo User')
    expect(screen.getByTestId('token-short')).toHaveTextContent('aaaaaaaaaaaa')
    expect(screen.getByTestId('token-short').textContent).toContain('…')
  })

  it('login fail shows error and stays on form', async () => {
    const user = userEvent.setup()
    mockFetchSequence([
      async () => ({
        ok: false,
        status: 401,
        json: async () => ({ message: '用户名或密码错误' }),
      }),
    ])

    render(<App />)
    await user.type(screen.getByLabelText('用户名'), 'demo')
    await user.type(screen.getByLabelText('密码'), 'wrong')
    await user.click(screen.getByRole('button', { name: '登录' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('用户名或密码错误')
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
  })
})
