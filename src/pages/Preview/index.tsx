/**
 * @file 预览页:将 components store 中的组件树用各物料的 prod(生产)组件真实渲染出来,
 * 并根据物料配置把用户设置的事件动作(跳转/提示/自定义JS/调用组件方法)绑定到组件上。
 */
import { ReactNode, createElement, useRef } from 'react'
import { Component, useComponentsStore } from '@/stores/components'
import { useComponentConfigStore } from '@/stores/componentConfig'
import { message } from 'antd'
import { ActionConfig } from '../Editor/components/Setting/ActionModal'

/**
 * 预览页组件,真实渲染组件树并绑定用户配置的事件动作
 */
export function Preview() {
  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  // 保存每个组件实例的 ref,供 componentMethod 动作跨组件调用其暴露的方法
  const componentRefs = useRef<Record<string, unknown>>({})

  /**
   * 根据物料配置的 events,把用户为该组件配置的事件动作转换为可执行的事件处理函数
   * @param component - 组件节点
   * @returns 事件名到处理函数的映射对象
   */
  function handleEvent(component: Component) {
    const { name, props } = component
    const config = componentConfig[name]
    if (!config) return
    const { events } = config
    if (!events) return

    const componentProps: Record<string, unknown> = {}

    events.forEach((event) => {
      // 取出用户在设置面板里为该事件配置的动作列表
      const eventConfig = props[event.name]
      if (eventConfig) {
        // 事件触发时依次执行所配置的每个动作
        componentProps[event.name] = (...args: unknown[]) => {
          eventConfig.actions.forEach((action: ActionConfig) => {
            if (action.type === 'goToLink') {
              // 跳转链接
              window.location.href = action.url
            } else if (action.type === 'showMessage') {
              // 弹出消息提示
              if (action.config.type === 'success') {
                message.success(action.config.text)
              } else if (action.config.type === 'error') {
                message.error(action.config.text)
              }
            } else if (action.type === 'customJS') {
              // 执行用户自定义 JS:通过 Function 构造器注入 context 与 args
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
              // 调用目标组件通过 ref 暴露的方法(如 Modal 的 open/close)
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

  /**
   * 递归渲染组件树:为每个组件用其 prod 组件创建元素,并合并默认属性、用户属性、样式与事件
   * @param components - 待渲染的组件节点数组
   * @returns 渲染后的 React 节点
   */
  function renderComponents(components: Component[]): ReactNode {
    return components.map((component) => {
      const { id, name, props, styles, children } = component
      const config = componentConfig[name]
      if (!config) return null
      const elementProps = {
        key: id,
        id: id,
        name: name,
        // 收集实例 ref,供 componentMethod 动作调用
        ref: (ref: unknown) => {
          componentRefs.current[id] = ref
        },
        ...config.defaultProps,
        ...props,
        styles,
        ...handleEvent(component),
      }

      // 未提供 prod 渲染组件的物料直接跳过
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
