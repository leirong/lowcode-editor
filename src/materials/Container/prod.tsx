/**
 * @file Container 物料的 prod(生产/预览态)组件
 */
import { PropsWithChildren } from "react"
import classNames from "classnames"

/**
 * Container 物料的 prod(生产/预览态)组件:运行时的真实容器。
 * 无拖拽、无边框、无 data-component-id,仅按样式渲染子组件
 * @param props - 组件属性
 */
export const Container = (props: CommonComponentProps & PropsWithChildren) => {
  const { styles, children } = props
  return (
    <div style={styles} className={classNames("p-[20px]")}>
      {children}
    </div>
  )
}
