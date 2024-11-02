import { CSSProperties } from "react"

// interface CommonComponentProps {
//   id: number
//   name: string
//   styles?: CSSProperties
// }

declare global {
  interface CommonComponentProps {
    id: number
    name: string
    styles?: CSSProperties
  }
}
