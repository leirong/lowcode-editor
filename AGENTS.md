# AGENTS.md

## 项目速览

- 这是一个 React LowCode Editor，入口是 `src/main.tsx`，路由在 `src/App.tsx`：`/` 是编辑器，`/preview` 是预览页。
- 应用部署在 GitHub Pages 子路径 `/lowcode-editor/`；不要随意改 `vite.config.ts` 的 `base` 或 `BrowserRouter basename={import.meta.env.BASE_URL}`。
- 编辑器三栏布局在 `src/pages/Editor/index.tsx`：左侧物料面板、中间画布、右侧属性/样式/事件设置。
- 预览页 `src/pages/Preview/index.tsx` 会用物料的 `prod` 组件递归渲染组件树，并执行事件动作，包括跳转、消息、自定义 JS、组件方法调用。

## 命令与环境

- 优先使用 `pnpm`：CI 明确使用 pnpm `11.11.0`、Node `24`，并执行 `pnpm install --frozen-lockfile`。
- 本地开发：`pnpm run dev`。
- 当前主要验证门禁：先 `pnpm run lint`，再 `pnpm run build`；`build` 实际执行 `tsc -b && vite build`。
- 本地预览构建产物：`pnpm run preview`。
- 发布相关脚本是 `pnpm run predeploy` 和 `pnpm run deploy`，但 GitHub Actions 在 `master` push 后构建 `dist` 并用 `peaceiris/actions-gh-pages` 发布。
- 仓库里没有配置 `test` 脚本，也没有已跟踪的 `*.test*` / `*.spec*` 文件；不要编造测试命令。

## 代码结构要点

- `@/*` 指向 `src/*`；Vite 里 `@` 指向 `/src`，TypeScript paths 也配置了 `@/*`。
- 物料统一从 `src/materials/index.ts` 导出，每个物料通常有 `dev.tsx`（编辑态）和 `prod.tsx`（预览/运行态）两套实现。
- 物料注册表在 `src/stores/componentConfig.tsx`，新增物料时要登记 `dev`、`prod`、`defaultProps`、`setter`、`stylesSetter`、`events`、`methods` 和容器类的 `accept`。
- 组件树状态在 `src/stores/components.tsx`，使用 `zustand` + `persist`，localStorage key 是 `lowcode-editor-store`；调试“刷新后还在”的状态时先想到这里。
- 初始组件树只有根节点 `Page`；拖拽能否嵌套由注册表里的 `accept` 控制，不只看组件文件。

## 开发约束

- TypeScript 配置开启 `strict`、`noUnusedLocals`、`noUnusedParameters`、`noUncheckedSideEffectImports`；未使用参数用 `_` 前缀，oxlint 已按此前缀放行。
- lint 使用 `oxlint`，配置在 `.oxlintrc.json`，插件包含 `react`、`typescript`、`oxc`，并忽略 `dist`。
- Tailwind 只扫描 `index.html` 和 `src/**/*.{js,ts,jsx,tsx}`；新增样式文件或模板路径时要同步检查 `tailwind.config.js`。
- Monaco 已在 `src/main.tsx` 配置为使用本地 `monaco-editor`，避免运行时从 CDN 拉取；不要改回默认 CDN 加载。

## 修改前检查

- 改路由、部署路径或资源路径时，同时核对 `vite.config.ts`、`src/main.tsx` 和 `.github/workflows/deploy.yml`。
- 改物料行为时，同时检查编辑态 `dev`、预览态 `prod`、注册表配置和预览页事件绑定。
- 需要回归验证但没有现成测试框架时，说明缺口，并至少运行 `pnpm run lint` 与 `pnpm run build`。
