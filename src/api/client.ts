import type { ErrorResponse, LoginRequest, LoginResponse, MeResponse } from './types'

/**
 * API 基址：
 * - 空字符串：相对路径，配合 Vite `/api` 代理（推荐本地联调）
 * - 绝对 URL：直连后端（需 CORS）
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw === undefined || raw === null) return ''
  return String(raw).replace(/\/$/, '')
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let message = `请求失败 (${res.status})`
  let code: string | undefined
  try {
    const body = (await res.json()) as ErrorResponse
    if (body.message) message = body.message
    if (body.code) code = body.code
  } catch {
    /* ignore non-JSON */
  }
  return new ApiError(res.status, message, code)
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw await parseError(res)
  return (await res.json()) as LoginResponse
}

export async function fetchMe(accessToken: string): Promise<MeResponse> {
  const base = getApiBaseUrl()
  const res = await fetch(`${base}/api/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw await parseError(res)
  return (await res.json()) as MeResponse
}
