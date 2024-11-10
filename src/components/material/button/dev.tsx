import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"
import { useDrag } from "react-dnd"

export interface ButtonProps {
  id: number
  styles?: CSSProperties
  type: ButtonType
  text: string
}

const Button = ({ id, styles, type, text }: ButtonProps) => {
  const [_, drag] = useDrag({
    type: "Button",
    item: {
      type: "Button",
      dragType: "move",
      id,
    },
  })

  return (
    <AntdButton ref={drag} data-component-id={id} type={type} style={styles}>
      {text}
    </AntdButton>
  )
}

export default Button
