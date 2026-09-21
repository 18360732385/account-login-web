import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchMe, getApiBaseUrl, login } from './client'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('getApiBaseUrl', () => {
  it('returns empty string by default for proxy mode', () => {
    expect(getApiBaseUrl()).toBe('')
  })
})

describe('login', () => {
  it('success returns token payload', async () => {
    const payload = {
      accessToken: 'jwt-demo',
      tokenType: 'Bearer',
      expiresInMs: 3600000,
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      }),
    )

    const res = await login({ username: 'demo', password: 'demo123' })
    expect(res).toEqual(payload)
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('fail surfaces ApiError with message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ code: 'BAD_CREDENTIALS', message: '用户名或密码错误' }),
      }),
    )

    await expect(login({ username: 'demo', password: 'wrong' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: '用户名或密码错误',
    } satisfies Partial<ApiError>)
  })
})

describe('fetchMe', () => {
  it('authed me returns profile', async () => {
    const me = { username: 'demo', displayName: 'Demo User' }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => me,
      }),
    )

    const res = await fetchMe('jwt-demo')
    expect(res).toEqual(me)
    expect(fetch).toHaveBeenCalledWith(
      '/api/me',
      expect.objectContaining({
        headers: { Authorization: 'Bearer jwt-demo' },
      }),
    )
  })

  it('unauthorized throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ code: 'UNAUTHORIZED', message: '需要登录' }),
      }),
    )

    await expect(fetchMe('bad')).rejects.toMatchObject({ status: 401, message: '需要登录' })
  })
})
