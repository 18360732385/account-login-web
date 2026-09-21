# Spec：账号登录前端

> 状态：已交付  
> 路径：F Full · slug：`2026-09-21-account-login-web`  
> 需求来源：`docs/requirements/账号登录前端.md`

## 1. 术语

| 术语 | 含义 |
|---|---|
| accessToken | 后端签发的 JWT，放在 `Authorization: Bearer` |
| API 基址 | `VITE_API_BASE_URL`；空则相对路径 + Vite 代理 |
| 会话（本轮） | 内存中的 Token + `/me` 资料；刷新即失 |

## 2. 范围

### 做

- 登录表单 UI（成功/失败/校验）
- API 客户端封装 login / fetchMe
- 成功页：username、displayName、Token 截断
- Vitest：API 单测 + App 流程测
- 开发代理 `/api` → `localhost:8080`

### 不做

- Token 持久化、刷新、登出服务端会话
- 修改 Java 后端 CORS（前端侧用代理消化）

## 3. API 消费契约（配对后端）

与 `account-login-java` Spec 对齐：

- `POST /api/auth/login` → `{ accessToken, tokenType, expiresInMs }`
- `GET /api/me` + Bearer → `{ username, displayName }`
- 401 → `{ code?, message }`

## 4. 前端架构

```
src/
  api/client.ts      # fetch 封装
  components/        # LoginForm / ProfileView
  App.tsx            # 状态机：未登录 | 已登录
```

## 5. 安全与 CORS

- 开发：Vite proxy 同源，绕过浏览器 CORS
- 直连：需后端提供可用 CORS；当前 Java 仅 `cors(withDefaults)` 无 `CorsConfigurationSource` → 直连易失败（记入摩擦）
- Token 仅存 React state，不写 localStorage（本轮）

## 6. 验收

见需求 §3；测试设计见 runs 内 `测试用例.md`。
