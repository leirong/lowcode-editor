import { Modal as AntdModal } from "antd"
import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react"

export interface ModalRef {
  open: () => void
  close: () => void
}

interface ModalProps extends CommonComponentProps, PropsWithChildren {
  title: string
  onOk: () => void
  onCancel: () => void
}

const Modal: ForwardRefRenderFunction<ModalRef, ModalProps> = (
  { children, title, onOk, onCancel, styles },
  ref
) => {
  const [open, setOpen] = useState(false)

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
      destroyOnClose
    >
      {children}
    </AntdModal>
  )
}

export default forwardRef(Modal)
