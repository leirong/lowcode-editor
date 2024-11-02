import { PropsWithChildren } from "react"
import classNames from "classnames"

const Container = (props: CommonComponentProps & PropsWithChildren) => {
  const { styles, children } = props
  return (
    <div style={styles} className={classNames("p-[20px]")}>
      {children}
    </div>
  )
}

export default Container
