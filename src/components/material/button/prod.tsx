import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"

export interface ButtonProps {
  id: number
  styles?: CSSProperties
  type: ButtonType
  text: string
}

const Button = (props: ButtonProps) => {
  const { id, styles, type, text, ...rest } = props
  return (
    <AntdButton type={type} style={styles} {...rest}>
      {text}
    </AntdButton>
  )
}

export default Button
