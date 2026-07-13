/**
 * @file Modal 物料的 dev(编辑态)组件
 */
import { PropsWithChildren } from 'react'
import { useItemDrop } from '../useItemDrop'
import { useComponentConfigStore } from '../../stores/componentConfig'

/** Modal 物料的 props:在通用 props 基础上增加标题 title */
interface ModalProps extends CommonComponentProps, PropsWithChildren {
  /** 弹窗标题 */
  title: string
}

/**
 * Modal 物料的 dev(编辑态)组件:画布中始终展开为一个普通区块,便于向弹窗内拖入子组件。
 * 相比 prod 版:不使用 antd Modal 弹层,而是平铺渲染为可放置的容器,并带 data-component-id
 * @param props - 组件属性
 */
export function Modal({ id, name, children, title, styles }: ModalProps) {
  const { componentConfig } = useComponentConfigStore()
  const { accept } = componentConfig[name]
  // 作为放置区,允许把子组件拖入弹窗内容
  const { canDrop, drop } = useItemDrop(accept!, id)

  return (
    <div
      // 注册为放置区
      ref={(node) => {
        drop(node)
      }}
      style={styles}
      data-component-id={id}
      // canDrop 时高亮蓝色边框
      className={`min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  )
}
