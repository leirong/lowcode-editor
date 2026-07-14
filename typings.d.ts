import { CSSProperties } from "react"

// interface CommonComponentProps {
//   id: string
//   name: string
//   styles?: CSSProperties
// }

declare global {
  interface CommonComponentProps {
    id: string
    name: string
    styles?: CSSProperties
  }
}
