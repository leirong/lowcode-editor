import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"

export interface ButtonProps {
  id: number
  styles?: CSSProperties
  type: ButtonType
  text: string
}

const Button = ({ id, styles, type, text }: ButtonProps) => {
  return (
    <AntdButton data-component-id={id} type={type} style={styles}>
      {text}
    </AntdButton>
  )
}

export default Button
