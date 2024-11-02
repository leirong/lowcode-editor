import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { getComponentById, useComponentsStore } from "../../stores/components"

interface HoverMaskProps {
  containerClassName: string
  portalWrapperClassName: string
  componentId: number
}

const HoverMask = ({
  containerClassName,
  portalWrapperClassName,
  componentId,
}: HoverMaskProps) => {
  const { components } = useComponentsStore()
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  })

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components)
  }, [componentId])

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!
  }, [])

  function updatePosition() {
    if (!componentId) return
    const container = document.querySelector(`.${containerClassName}`)
    if (!container) return
    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!node) return
    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect()

    const labelLeft = left - containerLeft + width
    let labelTop = top - containerTop + container.scrollTop

    if (labelTop <= 0) {
      labelTop += 20
    }

    setPosition({
      left: left - containerLeft + container.scrollLeft,
      top: top - containerTop + container.scrollTop,
      width,
      height,
      labelLeft,
      labelTop,
    })
  }

  useEffect(() => {
    updatePosition()
  }, [componentId, components])

  useEffect(() => {
    const container = document.querySelector(`.${containerClassName}`)!
    const ob = new ResizeObserver(() => {
      updatePosition()
    })
    ob.observe(container)
    return () => {
      ob.disconnect()
    }
  }, [])

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px solid blue",
          pointerEvents: "none",
          zIndex: 12,
          borderRadius: "5px",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <div
          style={{
            padding: "0 8px",
            backgroundColor: "blue",
            borderRadius: 4,
            color: "#fff",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {curComponent?.desc}
        </div>
      </div>
    </>,
    el
  )
}

export default HoverMask
