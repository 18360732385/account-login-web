import type { LoginResponse, MeResponse } from '../api/types'

export interface ProfileViewProps {
  me: MeResponse
  token: LoginResponse
  onLogout: () => void
}

function shortToken(token: string): string {
  if (token.length <= 24) return token
  return `${token.slice(0, 12)}…${token.slice(-8)}`
}

export function ProfileView({ me, token, onLogout }: ProfileViewProps) {
  return (
    <section className="card profile" aria-live="polite">
      <h1>当前用户</h1>
      <dl>
        <dt>用户名</dt>
        <dd data-testid="me-username">{me.username}</dd>
        <dt>显示名</dt>
        <dd data-testid="me-displayName">{me.displayName}</dd>
        <dt>Token 类型</dt>
        <dd>{token.tokenType}</dd>
        <dt>Token（截断）</dt>
        <dd data-testid="token-short" className="mono">
          {shortToken(token.accessToken)}
        </dd>
        <dt>过期（ms）</dt>
        <dd>{token.expiresInMs}</dd>
      </dl>
      <button type="button" onClick={onLogout}>
        退出
      </button>
    </section>
  )
}
