/**
 * @file Container 物料的 dev(编辑态)组件
 */
import { PropsWithChildren, useEffect, useRef } from 'react'
import { useComponentConfigStore } from '@/stores'
import classNames from 'classnames'
import { useItemDrop } from '../useItemDrop'
import { useDrag } from 'react-dnd'

/**
 * Container 物料的 dev(编辑态)组件:画布中的通用容器。
 * 相比 prod 版:既可被拖入子组件(drop),自身又可被拖动移动位置(drag)
 * @param props - 组件属性
 * @param props.id - 唯一标识
 * @param props.name - 组件名
 * @param props.styles - 样式
 * @param props.children - 子组件
 */
export const Container = ({ id, name, styles, children }: CommonComponentProps & PropsWithChildren) => {
  const { componentConfig } = useComponentConfigStore()
  const { accept } = componentConfig[name]

  // 作为放置区:接收允许的子组件
  const { canDrop, drop } = useItemDrop(accept!, id)

  const divRef = useRef<HTMLDivElement>(null)

  // 作为拖拽源:dragType 为 'move',拖动时把自身移动到其他容器中
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: 'move',
      id: id,
    },
  })

  // 同一 DOM 节点同时挂载 drop(接收子组件)与 drag(自身可拖动)能力
  useEffect(() => {
    drop(divRef)
    drag(divRef)
  }, [])

  return (
    <div
      ref={divRef}
      // data-component-id 供画布选中/定位使用
      data-component-id={id}
      style={styles}
      // canDrop 时用蓝色边框高亮可放置状态,否则显示常规边框
      className={classNames('min-h-[100px] p-[20px]', {
        'border-[2px] border-blue': canDrop,
        'border-[1px] border-[#000]': !canDrop,
      })}
    >
      {children}
    </div>
  )
}
