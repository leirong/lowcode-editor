import { ReactNode, createElement, useRef } from 'react'
import { Component, useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/componentConfig'
import { message } from 'antd'
import { ActionConfig } from '../../components/Setting/ActionModal'

export function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const componentRefs = useRef<Record<string, unknown>>({})

  function handleEvent(component: Component) {
    const { name, props } = component
    const config = componentConfig[name]
    if (!config) return
    const { events } = config
    if (!events) return

    const componentProps: Record<string, unknown> = {}

    events.forEach((event) => {
      const eventConfig = props[event.name]
      if (eventConfig) {
        componentProps[event.name] = (...args: unknown[]) => {
          eventConfig.actions.forEach((action: ActionConfig) => {
            if (action.type === 'goToLink') {
              window.location.href = action.url
            } else if (action.type === 'showMessage') {
              if (action.config.type === 'success') {
                message.success(action.config.text)
              } else if (action.config.type === 'error') {
                message.error(action.config.text)
              }
            } else if (action.type === 'customJS') {
              const func = new Function('context', 'args', action.code)
              func(
                {
                  name: component.name,
                  ...component.props,
                  showMessage() {
                    message.success('hello world')
                  },
                },
                args,
              )
            } else if (action.type === 'componentMethod') {
              const componentRef = componentRefs.current[action.config.componentId] as
                | Record<string, (...args: unknown[]) => void>
                | undefined
              if (componentRef) {
                componentRef[action.config.method]?.(...args)
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
        ref: (ref: unknown) => {
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

      return createElement(config.prod, { ...elementProps }, renderComponents(children || []))
    })
  }

  // renderComponents 内部通过 ref 回调写入 componentRefs(渲染后触发),规则对该间接调用误报。
  // eslint-disable-next-line react-hooks/refs
  return <div>{renderComponents(components)}</div>
}
