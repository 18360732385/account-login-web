# 设计：登出 + 改密前端

> 状态：已交付 · Path F · slug `2026-09-21-logout-change-password`

## 1. 术语
- **memory 会话**：Token 仅存 React state（O13）
- **消费契约**：以后端 Spec 为准

## 2. 消费契约（sibling API）
来源：`https://github.com/18360732385/account-login-java` → Spec `docs/superpowers/specs/2026-09-21-logout-change-password-设计.md`（收口后 archive）

| 调用 | 路径 | 前端行为 |
|---|---|---|
| logout | POST /api/auth/logout | 调 API；无论成败清空会话 |
| change-password | POST /api/auth/change-password | 成功→提示重登；失败→表单错误 |

## 3. UI
- ProfileView：退出登录按钮 + ChangePasswordForm（旧/新密码）
- 成功改密/登出后显示 info banner

## 4. 联调矩阵
- `api_base_mode: proxy`（默认）
- 亦可 absolute（后端 CORS 已就绪）→ `integration_ready: cors|proxy`

## 5. 会话存储
`memory` only（不写 localStorage）

## 6. 演示账号污染
勿与后端改密集成测试并行改写同一 demo 用户（O15）
