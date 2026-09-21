# feature-eng 摩擦日志 — 2026-09-21-account-login-web

> 本文件在运行过程中持续追加；close 后随主题迁入 archive。  
> 与后端轮次对照：O1–O7 若再次出现则标「validated by frontend run」。

## F1 — 绑定 skill 未安装（P0，validated O1）
- **何时**：start / Full 拟调 grill/design/spec/plan/testdesign/implement/verify
- **现象**：宿主无 stage-bindings 所指厨师 skill
- **处置**：`chef_mode: controller_proxy`；harness_land:false
- **证据**：本文件；`回链.md`

## F2 — 空仓仅 LICENSE/.gitignore，create-vite 拒写非空目录（P0，validated O2 + 新表层）
- **何时**：`npm create vite@latest . -- --template react-ts`
- **现象**：远程 size≈0；目录已有 `.git`/`LICENSE`/`.gitignore` → create-vite 「Operation cancelled」
- **处置**：先 `/tmp` 脚手架再 `cp -a` 入仓（本地 bootstrap + push）
- **证据**：shell 输出；远程 initial commit 仅模板文件

## F3 — 硬闸无真实聊天笔录（P1，validated O3）
- **何时**：各硬闸
- **处置**：`authorized_by: user_task_2026-09-21-web`；不伪造 transcript
- **证据**：`回链.md` 硬闸表

## F4 — Node 运行时 vs 工具链 engines 声明（P1，validated O4 模式 / 前端实例）
- **何时**：`npm install` vitest@5 / jsdom@30
- **现象**：本机 Node v20.19.2；依赖 EBADENGINE 要求 ≥22；jsdom@30 + undici 直接 `markAsUncloneable is not a function` 导致 worker 起不来
- **处置**：钉 `jsdom@24.1.3`；progress.env_notes 记录 runtime / 钉扎版本 / 原因
- **证据**：`npm test` 失败栈 → 降级后 7/7；`package.json` devDependencies

## F5 — 中文过程态文件名（P2，validated O6）
- **何时**：写入 `回链.md` / `测试用例.md` / `门禁清单.md`
- **处置**：按契约使用中文文件名；UTF-8
- **证据**：active 目录列表

## F6 — review_policy 默认 subagent，宿主无 Task（P1，validated O5）
- **何时**：gate
- **处置**：`review_policy: inline` + 门禁清单显式备注
- **证据**：`progress.yaml`；`门禁清单.md`

## F7 — close 双归档清单（P2，validated O7）
- **何时**：规划 close
- **处置**：按 O7 检查单执行；未跟踪用 `mv` 非 `git mv`
- **证据**：close 检查单勾选记录（本文件 close 段 / 优化点）

## F8 — 跨仓 API 契约发现无仪式位（P0，**NEW**）
- **何时**：design / implement 对齐 Java Spec
- **现象**：feature-eng Full 默认单仓；配对后端契约在另一 GitHub 仓。无「sibling_repo / contract_source」字段，只能人工打开 java Spec/README
- **处置**：Spec §3 手写消费契约；回链注明配对 URL；摩擦记跨仓缺口
- **证据**：`docs/superpowers/specs/...设计.md` §3；本条

## F9 — 后端 CORS withDefaults 无 Bean vs 前端代理（P0，**NEW**）
- **何时**：设计联调策略
- **现象**：Java `cors(Customizer.withDefaults())` 但无 `CorsConfigurationSource` → 浏览器直连跨域不可用；典礼模板无「全栈联调：CORS 或 proxy 二选一」检查项
- **处置**：Vite `/api` proxy + README 警示；不在本轮改 Java
- **证据**：`vite.config.ts`；Java `SecurityConfig.java`；README

## F10 — create-vite 非空目录与 feature-eng init 时序（P1，**NEW**）
- **何时**：O2 绿地 bootstrap
- **现象**：即便知道要本地脚手架，「在已有 LICENSE 的 Git 根目录跑 create-vite」仍失败；feature-eng init 未提示「前端脚手架工具要求空目录 → 用临时目录再合并」
- **处置**：tmp scaffold + copy；记入优化点 O8/O10
- **证据**：F2 shell；本条

## F11 — 前端测试环境（jsdom）与包管理 engines 漂移（P1，**NEW**）
- **何时**：首次 `npm test`
- **现象**：脚手架默认最新 Vitest/jsdom；LTS Node 20 常见于 CI/agent；典礼 env_verified 布尔不够表达「钉依赖版本」动作
- **处置**：env_notes 结构化 + 锁 jsdom major；建议 engines 或 overrides 文档化
- **证据**：F4；`package.json`

## F12 — Token 存储策略无模板提示（P2，**NEW**）
- **何时**：实现会话态
- **现象**：前端鉴权常见 localStorage vs memory 决策；Spec/Plan 模板无安全默认提示，易在实现时临时拍板
- **处置**：本轮明确 memory-only 写入 Spec §5
- **证据**：Spec；App.tsx state

## F13 — proto=entered 但无独立原型厨师（P2，**NEW**）
- **何时**：有 UI 的 Full 路径
- **现象**：bindings 中 proto→prototype skill 缺失；控制器用「设计笔记」文字草图代替可点击原型，边界靠自觉
- **处置**：proto=entered + 设计笔记草图；chef_mode 仍 proxy
- **证据**：`设计笔记.md`；progress.proto=entered

## Close 双归档 L1 检查单（O7）

### runs active → archive
- [x] progress.yaml：stage=done + gates.close + updated_at
- [x] 回链.md 最终产物指针补齐
- [x] active → archive（未跟踪用 mv）
- [x] runs README 进行中表已清空本主题

### Spec/Plan → superpowers/archive
- [x] 徽章「已交付」
- [x] Spec/Plan 移入 archive/specs|plans
- [x] superpowers README 进行中表已清
- [x] ARCHIVE.md 已追加
- [x] progress.artifacts 指向 archive
