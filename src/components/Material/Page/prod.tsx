import { PropsWithChildren } from "react"

export function Page(props: CommonComponentProps & PropsWithChildren) {
  const { styles, children } = props
  return (
    <div className="p-[20px]" style={styles}>
      {children}
    </div>
  )
}
