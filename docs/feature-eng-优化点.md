# feature-eng 优化点（前端 Full 轮次证据）

> 仅基于本仓 `docs/runs/archive/2026-09-21-account-login-web/feature-eng-friction.md`。  
> **O1–O7** 已在后端轮次提出：本轮若再次踩中，标「validated by frontend run」，**不重列为新 P0**。  
> 下文 **O8+** 为前端/全栈语境下的净新增摩擦。

## 已验证（O1–O7，不重复立项）

| 编号 | 本轮证据 | 说明 |
|---|---|---|
| O1 | F1 | `chef_mode: controller_proxy` 再次必需 |
| O2 | F2 | 空-ish 远程 + 本地脚手架再 push |
| O3 | F3 | `authorized_by: user_task_2026-09-21-web` |
| O4 | F4 | `env_notes`：Node 20 vs 工具链 ≥22；钉 jsdom |
| O5 | F6 | `review_policy: inline` 显式降级 |
| O6 | F5 | 中文过程态文件名 |
| O7 | F7 | close 双归档检查单（未跟踪用 mv） |

## P0（净新增）

### O8 — 跨仓全栈配对：`sibling_repo` / 契约源指针
- **摩擦**：F8
- **问题**：Path F 默认单仓心智；消费另一仓 API 时无 progress/回链 官方字段指向 sibling Spec，控制器只能口头粘贴契约，易漂移。
- **复现**：本仓 Spec §3 手抄 `account-login-java` 契约；回链写配对 URL。对照 skills 模板无 `contract_source` / `sibling_repos[]`。
- **建议**：
  1. progress 增加可选 `sibling_repos: [{ url, role: api|web, spec_path }]`
  2. start/grill 若用户提到「配对后端/前端」，强制填一条并在 回链「跨仓」节展示
  3. gate 检查：若 role=web 且声明了 api sibling，则 Spec 必须有「消费契约」小节或链接

### O9 — 全栈联调门禁：CORS **或** Dev Proxy 二选一
- **摩擦**：F9
- **问题**：浏览器联调要么后端 CORS 可用，要么前端同源代理。典礼无检查项；本轮 Java `cors(withDefaults)` 无 Bean → 直连必挂，靠 Vite proxy 挽救，属过程外知识。
- **复现**：读 java `SecurityConfig` + 本仓 `vite.config.ts` proxy；README 专节说明。
- **建议**：
  1. Full+UI 的 pre_impl/gate 增加联调矩阵：`cors_ready | proxy_ready | accepted_blocked`
  2. 模板 snippet：Vite `server.proxy['/api']` 与 Spring `CorsConfigurationSource` 二选一示例链到 QUICKSTART
  3. 若 sibling 后端 CORS 未就绪而前端未配 proxy → gate 失败（可 `accepted_residual`）

## P1（净新增）

### O10 — 前端脚手架工具「目录必须为空」与 init 合并配方
- **摩擦**：F2、F10
- **问题**：O2 解决「空仓要本地 bootstrap」，但未覆盖 `create-vite` / `create-next-app` 拒绝非空（已有 LICENSE/.git）目录。agent 常直接在 clone 根执行而 cancelled。
- **复现**：`npm create vite@latest .` → Operation cancelled；改 `/tmp` scaffold + `cp -a`。
- **建议**：
  1. QUICKSTART「绿地前端」步骤：`scaffold_dir=$(mktemp -d) && create-… && cp -a $scaffold_dir/. .`
  2. init 探测：若根目录仅有 VCS/LICENSE/gitignore 且无 package.json → 提示临时目录配方，而非直接失败

### O11 — 前端测试运行时矩阵（Node LTS × jsdom/vitest engines）
- **摩擦**：F4、F11
- **问题**：O4 已有 env_notes 思路（源于 JDK），前端还需「可钉的测试 DOM 实现」与 engines 告警。最新 create-vite 拉 Vitest5/jsdom30 偏好 Node22，而 agent/CI 仍常见 Node20 → 测试 worker 直接崩。
- **复现**：jsdom@30 → `webidl.util.markAsUncloneable is not a function`；钉 `jsdom@^24.1.3` 后 7/7。
- **建议**：
  1. env_notes schema 增加 `pinned_deps: [{ name, version, reason }]`
  2. verify 前自检：`node -v` 对照 `package.json#engines`（若有）与已知坏组合表
  3. 脚手架推荐 `engines.node` 下限与 README 徽章一致

### O12 — UI 路径下 proto 厨师缺失时的「轻量原型」契约
- **摩擦**：F13
- **问题**：有 UI 时 proto 应 entered，但 prototype skill 常缺；控制器用设计笔记文字草图代替，验收边界不清（算不算过 proto 闸）。
- **复现**：本轮 `proto: entered` + `设计笔记.md` 草图；无独立原型目录。
- **建议**：
  1. bindings 允许 `proto.skill: null` 时官方降级产物：`设计笔记.md` 必含交互草图 + 主路径 3 步
  2. gates-common：proxy 模式下 proto 闸通过条件写死为「草图+状态机」而非「可点击 HTML」

## P2（净新增）

### O13 — 前端鉴权会话默认（memory vs storage）提示条
- **摩擦**：F12
- **问题**：实现阶段才拍板 Token 存哪；模板无安全默认，演示仓易误用 localStorage。
- **复现**：Spec §5 事后写明 memory-only。
- **建议**：web+auth 类 Spec 模板增加「会话存储」必填枚举：`memory | sessionStorage | localStorage(+风险注)`

### O14 — `.env` / `VITE_*` 与 progress.env_notes 对齐
- **摩擦**：F9、F11（附带）
- **问题**：前端运行时配置在 `.env*`，典礼 env_notes 易只记 Node 版本而漏 API 基址策略。
- **复现**：本仓 `.env.example` + progress.env_notes 分头维护。
- **建议**：verify 清单要求粘贴「API 基址模式：proxy|absolute」一行到 env_notes

## 主题归纳（给父代理）

**已验证**：O1 绑定降级、O2 绿地 bootstrap、O3 任务授权码、O4 env_notes、O5 inline review、O6 中文文件名、O7 双归档。

**净新增**：
1. **跨仓契约指针**（O8）
2. **CORS/Proxy 联调门禁**（O9）
3. **非空目录前端脚手架配方**（O10）
4. **Node×jsdom 测试运行时矩阵**（O11）
5. **proto 轻量降级契约**（O12）
6. **会话存储默认 / VITE env 对齐**（O13/O14）
