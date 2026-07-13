import { useDrop } from 'react-dnd'
import { useComponentConfigStore } from '../stores/componentConfig'
import { getComponentById, useComponentsStore } from '../stores/components'
import { message } from 'antd'

/**
 * 拖拽项的数据结构:在 useDrag 中作为 item 传递,drop 时读取
 * - type:被拖拽物料的组件名(如 'Button'、'Container')
 * - dragType:区分两种拖拽来源 —— 'add' 从物料区新增组件、'move' 移动画布中已有组件
 * - id:仅 'move' 时有效,表示被移动组件在组件树中的 id
 */
export interface ItemType {
  type: string
  dragType?: 'add' | 'move'
  id: number
}

/**
 * 拖拽放置的公共 hook,被所有可作为"容器"的 dev 物料复用(Page/Container/Modal/Table/Form)
 * @param accept - 该容器允许接收的子组件类型列表(来自组件配置的 accept 字段)
 * @param id - 当前容器组件的 id,作为新组件/被移动组件的父节点
 * @returns 拖拽相关状态与 ref:canDrop(是否可放置)、drop(绑定到容器 DOM 的 drop ref)
 */
export function useItemDrop(accept: string[], id: number) {
  const { addComponent, components, deleteComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: ItemType, monitor) => {
      // 若拖拽已被更深层的嵌套容器处理过,则外层不再重复处理,避免组件被挂到错误的父节点
      const didDrop = monitor.didDrop()
      if (didDrop) return
      message.success(item.type)

      if (item.dragType === 'move') {
        // 移动已有组件:先从组件树中取出该组件,删除原位置,再挂到当前容器下(相当于移动)
        const component = getComponentById(item.id, components)!
        deleteComponent(item.id)
        addComponent(component, id)
      } else {
        // 新增物料:从组件配置读取默认 props 和描述,以时间戳作为唯一 id 创建新组件
        const { defaultProps: props, desc } = componentConfig[item.type]

        addComponent(
          {
            id: new Date().getTime(),
            name: item.type,
            desc,
            props,
            styles: {},
          },
          id,
        )
      }
    },
    // canDrop 用于 dev 组件高亮放置区域(如显示蓝色边框)
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }))
  return { canDrop, drop }
}
