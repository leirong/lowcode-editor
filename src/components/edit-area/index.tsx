import { ReactNode, createElement, useEffect } from "react"
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config"

export default function EditArea() {
  const { components, addComponent, deleteComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

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

  return (
    <div className="h-full">
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponents(components)}
    </div>
  )
}
