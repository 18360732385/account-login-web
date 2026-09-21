# feature-eng 优化点（全栈跨仓轮次）

> 证据：  
> - `account-login-web/docs/runs/archive/2026-09-21-logout-change-password/feature-eng-friction.md`  
> - `account-login-java/docs/runs/archive/2026-09-21-logout-change-password/feature-eng-friction.md`  
> 主题：`登出 + 改密` · `authorized_by: user_task_2026-09-21-fullstack` · Path F Full × 2 仓  
> **O1–O14** 若再次踩中仅标 validated，**不重列为新 P0**。下文 **O15+** 为跨仓/多代理净新增。

## 已验证（O1–O14）

| 编号 | 本轮证据 | 说明 |
|---|---|---|
| O1 | 双仓 F1 | `chef_mode: controller_proxy` |
| O3 | 双仓硬闸表 | `user_task_2026-09-21-fullstack`，无伪造聊天 |
| O4 | java env_notes | JDK21 vs target 17 |
| O5 | review_policy inline | 宿主无 Task |
| O6 | 中文过程态 | 回链/测试用例/设计笔记 |
| O7 | close 双归档 | runs + superpowers |
| O8 | sibling_repos | java↔web 互指 + 消费契约节 |
| O9 | integration_ready | `cors\|proxy` 双轨本轮均就绪 |
| O11 | pinned_deps | jsdom@24.1.3 |
| O12 | proto 轻量 | web 设计笔记草图+3 步 |
| O13 | memory 会话 | Spec 写明 |
| O14 | api_base_mode | proxy（兼 absolute） |

（O2/O10 本轮非绿地，未再触发。）

## P0（净新增 O15+）

### O15 — 跨仓 Spec/契约定稿顺序闸（API-first vs parallel）
- **摩擦**：java F9 / web F11
- **问题**：双仓 Full 并行时，若 FE Spec「消费契约」先于 API Spec 落盘，易手抄过期路径/字段；典礼无「契约所有者 + 定稿顺序」硬字段。
- **复现**：本轮刻意 **java Spec §2 先写**，web Spec §2 引用 sibling `spec_path`。若对调顺序，web 只能猜 logout body。
- **建议**：
  1. `sibling_repos[]` 增加 `contract_owner: true|false` 与 `contract_order: 1..n`
  2. start/grill：若存在 api+web 配对，默认提示 API-first；parallel 须用户显式 yes
  3. gate：web Spec 消费契约节的路径必须 resolve 到 sibling 已存在文件（或 `accepted_draft`）

### O16 — 共享演示账号 / 可变密钥的跨仓测试隔离
- **摩擦**：java F10 / web F12
- **问题**：内存 `DemoUserStore` 改密后，同进程后续用例与跨仓手工联调共用 `demo/demo123` 会失败；feature-eng 无「fixtures 可变性」检查。
- **复现**：change-password 集成测试若不 `@AfterEach resetCredentials`，后续 login 用例 401；FE README 亦须警告。
- **建议**：
  1. progress.env_notes 增加 `shared_fixtures: [{ name, mutable: true, reset: hook|restart }]`
  2. verify 清单：若 Spec 含 change-password / 删除类副作用 → 强制写恢复策略
  3. 跨仓联调文档模板：「改密后重启 API」一行

## P1（净新增）

### O17 — 联调通道所有权（CORS owner vs Proxy owner）
- **摩擦**：java F11 / web F13
- **问题**：O9 要求 cors **或** proxy 二选一；本轮两者都做后，仍无「默认推荐通道 / 谁维护」字段，双边可能重复实现或互相假设对方已就绪。
- **复现**：java 补 `CorsConfigurationSource`；web 保留 Vite proxy；`integration_ready: cors|proxy` 记录双就绪，但 README 需人工解释优先级。
- **建议**：
  1. `integration_ready` 扩展为对象：`{ modes: [cors, proxy], preferred: proxy|cors, cors_owner: api, proxy_owner: web }`
  2. QUICKSTART：双就绪时默认推荐 proxy（本地）/ cors（preview 直连）矩阵表

### O18 — 双仓同主题 slug 与优化点文档所有权
- **摩擦**：java F12 / web F14
- **问题**：两仓使用相同 slug `2026-09-21-logout-change-password` 合理，但「单一 consolidated 优化分析」写在哪、如何镜像链接，典礼未规定 → 易重复写或只写一边。
- **复现**：本轮主文档落 web `docs/feature-eng-优化点-fullstack.md`，java 放镜像指针。
- **建议**：
  1. close 增加 `optimization_doc: { primary_repo_role: web|api, path, mirror_path }`
  2. 双仓 close 检查：primary 存在且 mirror 至少有链接段

## P2（净新增）

### O19 — 多仓 handoff 进度可见性（谁卡在哪一环）
- **问题**：controller_proxy 单代理串行两仓时，无「配对仓当前 stage」仪表；用户/父代理难判断 API 是否已过 go。
- **建议**：回链「跨仓」节增加 `sibling_stage_hint`（手动粘贴对仓 stage）或可选读取本地 `../sibling/docs/runs/active/*/progress.yaml`（同 machine workspace 约定）

## 主题归纳（给父代理）

**再次验证**：O1/O3–O9/O11–O14。

**净新增（O15+）**：
1. **契约定稿顺序闸**（O15，P0）
2. **可变共享 fixture 隔离**（O16，P0）
3. **联调通道所有权**（O17，P1）
4. **双仓优化文档所有权**（O18，P1）
5. **跨仓 stage 可见性**（O19，P2）
