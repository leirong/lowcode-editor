import { ReactNode, createElement } from "react"
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config"
import { message } from "antd"

export default function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  function handleEvent(component: Component) {
    const { name, props } = component
    const config = componentConfig[name]
    if (!config) return
    const { events } = config
    if (!events) return

    const componentProps: Record<string, any> = {}

    events.forEach((event) => {
      const eventConfig = props[event.name]
      if (eventConfig) {
        const { type } = eventConfig
        if (type === "goToLink" && eventConfig.url) {
          componentProps[event.name] = () => {
            window.location.href = eventConfig.url
          }
        } else if (type === "showMessage" && eventConfig.config) {
          if (eventConfig.config.type === "success") {
            componentProps[event.name] = () => {
              message.success(eventConfig.config.text)
            }
          } else if (eventConfig.config.type === "error") {
            componentProps[event.name] = () => {
              message.error(eventConfig.config.text)
            }
          }
        }
      }
    })

    console.log("componentProps :>> ", componentProps)

    return componentProps
  }

  function renderComponents(components: Component[]): ReactNode {
    return components.map((component) => {
      const { id, name, props, styles, children } = component
      const config = componentConfig[name]
      if (!config) return null
      const elementProps = {
        key: id,
        id: id,
        name: name,
        ...config.defaultProps,
        ...props,
        styles,
        ...handleEvent(component),
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
