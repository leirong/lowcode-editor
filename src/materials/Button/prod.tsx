import { Button as AntdButton } from 'antd'
import { ButtonType } from 'antd/es/button'
import { CSSProperties } from 'react'

export interface ButtonProps {
  id: number
  styles?: CSSProperties
  type: ButtonType
  text: string
}

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
