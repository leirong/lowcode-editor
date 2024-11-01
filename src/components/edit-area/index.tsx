import {
  MouseEventHandler,
  ReactNode,
  createElement,
  useEffect,
  useState,
} from "react"
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config"
import HoverMask from "../hover-mask"

export default function EditArea() {
  const { components, addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  const [hoveredComponentId, setHoveredComponentId] = useState<number>()

  useEffect(() => {
    addComponent(
      {
        id: 222,
        name: "Container",
        props: {},
        children: [],
      },
      1
    )
    addComponent(
      {
        id: 333,
        name: "Button",
        props: {},
        children: [],
      },
      222
    )
  }, [])

  function renderComponents(components: Component[]): ReactNode {
    return components.map((component) => {
      const config = componentConfig[component.name]
      if (!config) return null
      const props = {
        key: component.id,
        id: component.id,
        name: component.name,
        ...config.defaultProps,
        ...component.props,
      }
      return createElement(
        config.component,
        { ...props },
        renderComponents(component.children || [])
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

  return (
    <div
      className="h-full edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {hoveredComponentId && (
        <HoverMask
          containerClassName="edit-area"
          portalWrapperClassName="portal-wrapper"
          componentId={hoveredComponentId}
        />
      )}
      {renderComponents(components)}
      <div className="portal-wrapper"></div>
    </div>
  )
}
