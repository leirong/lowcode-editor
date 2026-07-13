/**
 * @file Page 物料的 prod(生产/预览态)组件
 */
import { PropsWithChildren } from "react"

/**
 * Page 物料的 prod(生产/预览态)组件:预览或运行时的真实渲染版本。
 * 不含拖拽放置、不带 data-component-id,只按样式渲染页面根容器与子组件
 * @param props - 组件属性
 */
export function Page(props: CommonComponentProps & PropsWithChildren) {
  const { styles, children } = props
  return (
    <div className="p-[20px]" style={styles}>
      {children}
    </div>
  )
}
