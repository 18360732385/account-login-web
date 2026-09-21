# Plan：账号登录前端

> 状态：已交付  
> slug：`2026-09-21-account-login-web`

## 任务

| ID | 标题 | 依赖 | 状态 |
|---|---|---|---|
| T1 | Vite+React+TS 脚手架与代理/env | — | done |
| T2 | API client（login / me / ApiError） | T1 | done |
| T3 | LoginForm + ProfileView + App 状态 | T2 | done |
| T4 | Vitest：成功/失败/me | T2,T3 | done |
| T5 | README 与需求文档 | T1 | done |
| T6 | feature-eng 过程态与收口 | T4 | done |

## 实施顺序

1. 空仓 pull → 本地脚手架（O2；create-vite 需临时目录）
2. 配 proxy + `.env.example`
3. 实现 UI/API → 测试绿 → build 绿
4. 典礼文档齐全后 close 双归档
