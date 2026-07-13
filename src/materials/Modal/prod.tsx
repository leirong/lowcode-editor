/**
 * @file Modal 物料的 prod(生产/预览态)组件
 */
import { Modal as AntdModal } from "antd"
import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react"

/** Modal 对外暴露的 ref 方法:供其他组件的事件(如按钮点击)通过 ref 控制弹窗显隐 */
export interface ModalRef {
  open: () => void
  close: () => void
}

/** Modal 物料的 props */
interface ModalProps extends CommonComponentProps, PropsWithChildren {
  /** 弹窗标题 */
  title: string
  /** 确认回调,由运行时的事件配置注入 */
  onOk: () => void
  /** 取消回调,由运行时的事件配置注入 */
  onCancel: () => void
}

/**
 * Modal 物料的 prod(生产/预览态)组件:运行时真实的 antd 弹窗。
 * 用 forwardRef + useImperativeHandle 向外暴露 open/close,弹窗显隐由内部 open state 控制
 * @param props - 组件属性
 * @param ref - 转发的 ref,用于挂载 open/close 方法
 */
const ModalRender: ForwardRefRenderFunction<ModalRef, ModalProps> = (
  { children, title, onOk, onCancel, styles },
  ref
) => {
  const [open, setOpen] = useState(false)

  // 将 open/close 方法挂到 ref 上,外部拿到 Modal 实例即可命令式控制显隐
  useImperativeHandle(
    ref,
    () => {
      return {
        open: () => {
          setOpen(true)
        },
        close: () => {
          setOpen(false)
        },
      }
    },
    []
  )

  return (
    <AntdModal
      title={title}
      style={styles}
      open={open}
      onCancel={() => {
        onCancel?.()
        setOpen(false)
      }}
      onOk={() => {
        onOk?.()
      }}
      // 关闭时销毁内部内容,避免子组件状态残留
      destroyOnClose
    >
      {children}
    </AntdModal>
  )
}

/** 用 forwardRef 包装,使父级可通过 ref 调用上面暴露的 open/close */
export const Modal = forwardRef(ModalRender)
