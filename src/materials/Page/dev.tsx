/**
 * @file Page 物料的 dev(编辑态)组件:编辑器画布的根容器
 */
import { PropsWithChildren } from 'react'
import { useComponentConfigStore } from '../../stores/componentConfig'
import { useItemDrop } from '../useItemDrop'

/**
 * Page 物料的 dev(编辑态)组件:编辑器画布的根容器。
 * 相比 prod 版:注册了 drop 放置区、带 data-component-id 便于选中/定位,且可拖入子组件
 * @param props - 组件属性
 * @param props.id - 组件唯一标识
 * @param props.name - 组件名
 * @param props.styles - 自定义样式
 * @param props.children - 子组件
 */
export function Page({ id, name, styles, children }: CommonComponentProps & PropsWithChildren) {
  const { componentConfig } = useComponentConfigStore()
  // 从配置读取该组件允许接收的子组件类型
  const { accept } = componentConfig[name]
  const { canDrop, drop } = useItemDrop(accept!, id)
  return (
    <div
      // 将该 div 注册为拖拽放置区,拖入物料时触发 useItemDrop 的 drop 逻辑
      ref={(node) => {
        drop(node)
      }}
      // data-component-id 供画布的选中框/事件代理通过 DOM 反查组件 id
      data-component-id={id}
      className='p-[20px] h-[100%] box-border'
      // canDrop 时高亮蓝色边框,提示当前可放置
      style={{ ...styles, border: canDrop ? '2px solid blue' : 'none' }}
    >
      {children}
    </div>
  )
}
