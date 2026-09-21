export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresInMs: number
}

export interface MeResponse {
  username: string
  displayName: string
}

export interface ErrorResponse {
  code?: string
  message?: string
}
