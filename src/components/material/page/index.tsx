import { PropsWithChildren } from "react"
import { useComponentConfigStore } from "../../../stores/component-config"
import { useItemDrop } from "../../../hooks/useItemDrap"

function Page({ id, children }: CommonComponentProps & PropsWithChildren) {
  const { componentConfig } = useComponentConfigStore()
  const accept = Object.keys(componentConfig).filter((key) => key !== "Page")
  const { canDrop, drop } = useItemDrop(accept, id)
  return (
    <div
      ref={drop}
      data-component-id={id}
      className="p-[20px] h-[100%] box-border"
      style={{ border: canDrop ? "2px solid blue" : "none" }}
    >
      {children}
    </div>
  )
}

export default Page
