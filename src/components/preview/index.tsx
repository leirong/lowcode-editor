import { ReactNode, createElement } from "react"
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config"

export default function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

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

      if (!config?.prod) {
        return null
      }

      return createElement(
        config.prod,
        { ...elementProps },
        renderComponents(children || [])
      )
    })
  }

  return <div>{renderComponents(components)}</div>
}
