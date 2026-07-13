/**
 * @file 物料列表:读取物料注册表,渲染出所有可拖拽的物料项(排除根组件 Page)。
 */
import { useMemo } from 'react'
import { useComponentConfigStore } from '../../../../../stores/componentConfig'
import { DragItem } from '../DragItem'

export function MaterialList() {
  const { componentConfig } = useComponentConfigStore()

  // Page 是页面根节点,不作为可拖拽物料展示
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
