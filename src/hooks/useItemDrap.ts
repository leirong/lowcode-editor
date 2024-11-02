import { useDrop } from "react-dnd"
import { useComponentConfigStore } from "../stores/component-config"
import { useComponentsStore } from "../stores/components"
import { message } from "antd"

export function useItemDrop(accept: string[], id: number) {
  const { addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) return
      message.success(item.type)

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
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }))
  return { canDrop, drop }
}