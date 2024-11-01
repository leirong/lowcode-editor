import { PropsWithChildren } from "react"
import { useComponentConfigStore } from "../../../stores/component-config"
import { useItemDrop } from "../../../hooks/useItemDrap"

function Page({ id, children }: CommonComponentProps & PropsWithChildren) {
  const { componentConfig } = useComponentConfigStore()
  const accept = Object.keys(componentConfig).filter((key) => key !== "Page")
  const { canDrop, drop } = useItemDrop(accept, id)

  // const { addComponent } = useComponentsStore()
  // const accept = Object.keys(componentConfig).filter((key) => key !== "Page")
  // const [{ canDrop }, drop] = useDrop(() => ({
  //   accept,
  //   drop: (item: { type: string }, monitor) => {
  //     const didDrop = monitor.didDrop()
  //     if (didDrop) return
  //     message.success(item.type)

  //     const props = componentConfig[item.type].defaultProps

  //     addComponent(
  //       {
  //         id: new Date().getTime(),
  //         name: item.type,
  //         props,
  //       },
  //       id
  //     )
  //   },
  //   collect: (monitor) => ({
  //     canDrop: monitor.canDrop(),
  //   }),
  // }))
  return (
    <div
      ref={drop}
      className="p-[20px] h-[100%] box-border"
      style={{ border: canDrop ? "2px solid blue" : "none" }}
    >
      {children}
    </div>
  )
}

export default Page
