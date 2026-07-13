/**
 * @file Button 物料的 dev(编辑态)组件
 */
import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"
import { useDrag } from "react-dnd"

/** Button 物料的 props */
export interface ButtonProps {
  /** 组件唯一标识 */
  id: number
  /** 自定义样式 */
  styles?: CSSProperties
  /** antd 按钮类型(primary/default 等) */
  type: ButtonType
  /** 按钮文本 */
  text: string
}

/**
 * Button 物料的 dev(编辑态)组件:画布中的按钮。
 * 相比 prod 版:注册为可拖动的 drag 源(dragType 'move'),并带 data-component-id 便于选中。
 * 按钮本身不是容器,故只需 drag、无需 drop
 * @param props - 组件属性
 */
export const Button = ({ id, styles, type, text }: ButtonProps) => {
  const [_, drag] = useDrag({
    type: "Button",
    item: {
      type: "Button",
      dragType: "move",
      id,
    },
  })

  return (
    <AntdButton
      // 将按钮 DOM 注册为拖拽源,支持在画布中拖动改变位置
      ref={(node) => {
        drag(node)
      }}
      data-component-id={id}
      type={type}
      style={styles}
    >
      {text}
    </AntdButton>
  )
}
