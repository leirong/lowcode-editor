import { PropsWithChildren } from "react"
import { useComponentConfigStore } from "../../../stores/component-config"
import classNames from "classnames"
import { useItemDrop } from "../../../hooks/useItemDrap"

const Container = ({
  id,
  children,
}: CommonComponentProps & PropsWithChildren) => {
  const { componentConfig } = useComponentConfigStore()
  const accept = Object.keys(componentConfig).filter((key) => key !== "Page")
  const { canDrop, drop } = useItemDrop(accept, id)
  return (
    <div
      ref={drop}
      data-component-id={id}
      className={classNames("min-h-[100px] p-[20px]", {
        "border-[2px] border-blue": canDrop,
        "border-[1px] border-[#000]": !canDrop,
      })}
    >
      {children}
    </div>
  )
}

export default Container
