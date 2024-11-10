import { useDrop } from "react-dnd"
import { useComponentConfigStore } from "../stores/component-config"
import { getComponentById, useComponentsStore } from "../stores/components"
import { message } from "antd"

export interface ItemType {
  type: string
  dragType?: "add" | "move"
  id: number
}

export function useItemDrop(accept: string[], id: number) {
  const { addComponent, components, deleteComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: ItemType, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) return
      message.success(item.type)

      if (item.dragType === "move") {
        const component = getComponentById(item.id, components)!
        deleteComponent(item.id)
        addComponent(component, id)
      } else {
        const { defaultProps: props, desc } = componentConfig[item.type]

        addComponent(
          {
            id: new Date().getTime(),
            name: item.type,
            desc,
            props,
            styles: {},
          },
          id
        )
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }))
  return { canDrop, drop }
}
