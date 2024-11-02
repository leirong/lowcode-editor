import { useMemo } from "react"
import { useComponentConfigStore } from "../../../stores/component-config"
import DragItem from "../drag-item"

export default function Material() {
  const { componentConfig } = useComponentConfigStore()

  const components = useMemo(() => {
    return Object.values(componentConfig).filter((item) => item.name !== "Page")
  }, [componentConfig])
  return (
    <div>
      {components.map((item, index) => {
        return <DragItem key={index} name={item.name} desc={item.desc} />
      })}
    </div>
  )
}
