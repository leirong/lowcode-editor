import { PropsWithChildren } from "react"

function Page(props: CommonComponentProps & PropsWithChildren) {
  const { styles, children } = props
  return (
    <div className="p-[20px]" style={styles}>
      {children}
    </div>
  )
}

export default Page
