/**
 * @file Button 物料的 prod(生产/预览态)组件
 */
import { Button as AntdButton } from 'antd'
import { ButtonType } from 'antd/es/button'
import { CSSProperties } from 'react'

/** Button 物料的 props(同 dev 版) */
export interface ButtonProps {
  id: number
  styles?: CSSProperties
  type: ButtonType
  text: string
}

/**
 * Button 物料的 prod(生产/预览态)组件:运行时的真实按钮。
 * 无拖拽、无 data-component-id;id 在此不需要,故解构丢弃,rest 透传其余属性(如运行时注入的 onClick)
 * @param props - 组件属性
 */
export const Button = (props: ButtonProps) => {
  const { id: _id, styles, type, text, ...rest } = props
  return (
    <AntdButton
      type={type}
      style={styles}
      {...rest}
    >
      {text}
    </AntdButton>
  )
}
