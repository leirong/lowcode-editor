import { PropsWithChildren, useEffect, useRef } from "react"
import { useComponentConfigStore } from "../../../stores/component-config"
import classNames from "classnames"
import { useItemDrop } from "../../../hooks/useItemDrop"
import { useDrag } from "react-dnd"

const Container = ({
  id,
  name,
  styles,
  children,
}: CommonComponentProps & PropsWithChildren) => {
  const { componentConfig } = useComponentConfigStore()
  const { accept } = componentConfig[name]

  const { canDrop, drop } = useItemDrop(accept!, id)

  const divRef = useRef<HTMLDivElement>(null)

  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  })

  useEffect(() => {
    drop(divRef)
    drag(divRef)
  }, [])

  return (
    <div
      ref={divRef}
      data-component-id={id}
      style={styles}
      className={classNames("min-h-[100px] p-[20px]", {
        "border-[2px] border-blue": canDrop,
        "border-[1px] border-[#000]": !canDrop,
      })}
    >
      {children}
    </div>
  )
}

export default Container
