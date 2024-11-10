import { PropsWithChildren } from "react"
import { useComponentConfigStore } from "../../../stores/component-config"
import { useItemDrop } from "../../../hooks/useItemDrop"

function Page({
  id,
  name,
  styles,
  children,
}: CommonComponentProps & PropsWithChildren) {
  const { componentConfig } = useComponentConfigStore()
  const { accept } = componentConfig[name]
  const { canDrop, drop } = useItemDrop(accept!, id)
  return (
    <div
      ref={drop}
      data-component-id={id}
      className="p-[20px] h-[100%] box-border"
      style={{ ...styles, border: canDrop ? "2px solid blue" : "none" }}
    >
      {children}
    </div>
  )
}

export default Page
