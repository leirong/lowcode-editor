import { ReactNode, createElement, useRef } from "react"
import { Component, useComponentsStore } from "../../stores/components"
import { useComponentConfigStore } from "../../stores/component-config"
import { message } from "antd"
import { ActionConfig } from "../setting/action-modal"

export default function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const componentRefs = useRef<Record<string, any>>({})

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
        componentProps[event.name] = () => {
          eventConfig.actions.forEach((action: ActionConfig) => {
            if (action.type === "goToLink") {
              window.location.href = action.url
            } else if (action.type === "showMessage") {
              if (action.config.type === "success") {
                message.success(action.config.text)
              } else if (action.config.type === "error") {
                message.error(action.config.text)
              }
            } else if (action.type === "customJS") {
              const func = new Function("context", action.code)
              func({
                name: component.name,
                ...component.props,
                showMessage() {
                  message.success("hello world")
                },
              })
            } else if (action.type === "componentMethod") {
              const componentRef =
                componentRefs.current[action.config.componentId]
              if (componentRef) {
                componentRef[action.config.method]?.()
              }
            }
          })
        }
      }
    })

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
        ref: (ref: any) => {
          componentRefs.current[id] = ref
        },
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
