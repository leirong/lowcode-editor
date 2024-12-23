import { MouseEventHandler, ReactNode, createElement, useState } from "react"
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config"
import HoverMask from "../hover-mask"
import SelectedMask from "../selected-mask"

export default function EditArea() {
  const { components, setCurComponentId, curComponentId } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  const [hoveredComponentId, setHoveredComponentId] = useState<number>()

  function renderComponents(components: Component[]): ReactNode {
    return components.map(({ id, name, props, styles, children }) => {
      const config = componentConfig[name]
      if (!config) return null
      const elementProps = {
        key: id,
        id: id,
        name: name,
        ...config.defaultProps,
        ...props,
        styles,
      }

      if (!config?.dev) {
        return null
      }

      return createElement(
        config.dev,
        { ...elementProps },
        renderComponents(children || [])
      )
    })
  }

  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement

      const componentId = ele.dataset?.componentId
      if (componentId) {
        setHoveredComponentId(+componentId)
        return
      }
    }
  }

  const handleMouseLeave: MouseEventHandler = () => {
    setHoveredComponentId(undefined)
  }

  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement

      const componentId = ele.dataset?.componentId
      if (componentId) {
        setCurComponentId(+componentId)
        return
      }
    }
  }

  return (
    <div
      className="h-full edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {hoveredComponentId && hoveredComponentId !== curComponentId && (
        <HoverMask
          containerClassName="edit-area"
          portalWrapperClassName="portal-wrapper"
          componentId={hoveredComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          containerClassName="edit-area"
          portalWrapperClassName="portal-wrapper"
          componentId={curComponentId}
        />
      )}
      {renderComponents(components)}
      <div className="portal-wrapper"></div>
    </div>
  )
}
