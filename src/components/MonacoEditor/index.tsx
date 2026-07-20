/**
 * @file Monaco 编辑器的懒加载封装。
 * 首次渲染时才动态加载 @monaco-editor/react 与 monaco-editor,把体积庞大的编辑器
 * 从首屏主包里拆出去;同时在此完成 loader.config,让编辑器用本地打包的 monaco,
 * 而非默认从 CDN 运行时拉取(代理/离线环境下会一直卡在 "Loading...")。
 */
import { lazy, Suspense, type ComponentProps } from "react"

const LazyMonaco = lazy(async () => {
  const [reactMonaco, monaco] = await Promise.all([
    import("@monaco-editor/react"),
    import("monaco-editor"),
  ])
  reactMonaco.loader.config({ monaco })
  return { default: reactMonaco.default }
})

/** 编辑器挂载回调类型,从懒加载组件的 props 推导,避免直接依赖 monaco 包 */
export type OnMount = NonNullable<ComponentProps<typeof LazyMonaco>["onMount"]>

/**
 * 懒加载的 Monaco 编辑器,props 与 @monaco-editor/react 的默认导出完全一致。
 * @param props - 透传给底层 MonacoEditor 的属性
 */
export function MonacoEditor(props: ComponentProps<typeof LazyMonaco>) {
  return (
    <Suspense fallback={<div className="p-2 text-gray-400">编辑器加载中…</div>}>
      <LazyMonaco {...props} />
    </Suspense>
  )
}
