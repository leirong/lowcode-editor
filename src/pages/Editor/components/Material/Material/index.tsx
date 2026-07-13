import { useMemo } from 'react'
import { useComponentConfigStore } from '../../../../../stores/componentConfig'
import { DragItem } from '../DragItem'

export function Material() {
  const { componentConfig } = useComponentConfigStore()

  const components = useMemo(() => {
    return Object.values(componentConfig).filter((item) => item.name !== 'Page')
  }, [componentConfig])
  return (
    <div>
      {components.map((item, index) => {
        return (
          <DragItem
            key={index}
            name={item.name}
            desc={item.desc}
          />
        )
      })}
    </div>
  )
}
