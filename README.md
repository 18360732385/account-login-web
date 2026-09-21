# account-login-web

Vite + React + TypeScript 登录前端，对接 [account-login-java](https://github.com/18360732385/account-login-java)（Spring Boot JWT）。

## 要求

- Node.js 20+（本机验证：v20.19.2；部分依赖声明偏好 ≥22，见 `docs/runs` 中 env_notes）
- npm 9+

## 快速开始

```bash
# 1) 后端（另一终端）
cd ../account-login-java   # 或克隆后进入
mvn spring-boot:run        # http://localhost:8080

# 2) 前端
cp .env.example .env.development   # 可选；仓库已带开发默认
npm install
npm run dev                        # http://localhost:5173
```

开发期默认 `VITE_API_BASE_URL` 为空，请求走相对路径 `/api/*`，由 `vite.config.ts` **代理**到 `http://localhost:8080`，避免浏览器 CORS。  
（后端 `cors(Customizer.withDefaults())` 但未提供 `CorsConfigurationSource` 时，直连跨域会被拦。）

### 直连后端（需 CORS）

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
```

## 演示账号

| 用户名 | 密码 |
|---|---|
| `demo` | `demo123` |
| `admin` | `admin123` |

## 脚本

```bash
npm test          # Vitest
npm run build     # tsc + vite build
npm run preview   # 预览产物
```

## 行为说明

1. 登录表单提交 → `POST /api/auth/login`
2. 成功后带 Bearer Token → `GET /api/me`
3. 展示用户名/显示名 + Token 截断视图；失败展示错误态

## 文档

- 产品需求：`docs/requirements/账号登录前端.md`
- feature-eng 过程态：`docs/runs/`
- Spec / Plan：`docs/superpowers/`

## License

MIT
