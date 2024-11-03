import { PropsWithChildren } from "react"
import { useItemDrop } from "../../../hooks/useItemDrap"

interface ModalProps extends CommonComponentProps, PropsWithChildren {
  title: string
}

function Modal({ id, children, title, styles }: ModalProps) {
  const { canDrop, drop } = useItemDrop(["Button", "Container"], id)

  return (
    <div
      ref={drop}
      style={styles}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  )
}

export default Modal
