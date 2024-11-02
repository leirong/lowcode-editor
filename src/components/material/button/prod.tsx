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
  const { styles, type, text } = props
  return (
    <AntdButton type={type} style={styles}>
      {text}
    </AntdButton>
  )
}

export default Button
