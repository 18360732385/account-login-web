# account-login-web

Vite + React + TypeScript 登录前端，对接 [account-login-java](https://github.com/18360732385/account-login-java)（Spring Boot JWT）。支持 **登出** 与 **改密（需旧密码）**。

## 要求

- Node.js 20+（本机验证：v20.19.2）
- npm 9+

## 快速开始

```bash
# 1) 后端（另一终端）
cd ../account-login-java
mvn spring-boot:run        # http://localhost:8080

# 2) 前端
npm install
npm run dev                # http://localhost:5173
```

开发期默认 `VITE_API_BASE_URL` 为空，请求走相对路径 `/api/*`，由 Vite **代理**到 `http://localhost:8080`。  
后端现已提供最小 `CorsConfigurationSource`，亦可直连：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
```

## 演示账号

| 用户名 | 密码 |
|---|---|
| `demo` | `demo123` |
| `admin` | `admin123` |

> 若在 UI 中改密，内存用户密码会变；重启 Java 进程可恢复预置口令。联调/测试勿与后端改密用例并发污染同一账号。

## 行为说明

1. 登录 → `POST /api/auth/login` → `GET /api/me`
2. 退出登录 → `POST /api/auth/logout` + 清空会话（服务端失败仍清本地）
3. 改密 → `POST /api/auth/change-password`；成功提示「请重新登录」并回到表单

## 脚本

```bash
npm test          # Vitest
npm run build     # tsc + vite build
npm run preview
```

## 文档

- 需求：`docs/requirements/`
- feature-eng：`docs/runs/`
- Spec / Plan：`docs/superpowers/`
- **全栈优化点**：`docs/feature-eng-优化点-fullstack.md`

## License

MIT
