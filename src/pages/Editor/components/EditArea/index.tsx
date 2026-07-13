import { MouseEventHandler, ReactNode, createElement, useState } from 'react'
import { Component, useComponentsStore } from '@/stores/components'
import { useComponentConfigStore } from '@/stores/componentConfig'
import { HoverMask } from './HoverMask'
import { SelectedMask } from './SelectedMask'

export function EditArea() {
  const { components, setCurComponentId, curComponentId } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  // 当前鼠标悬浮的组件 id,用于控制悬浮遮罩的显示
  const [hoveredComponentId, setHoveredComponentId] = useState<number>()

  /**
   * 递归渲染组件树:遍历每个组件节点,并对其 children 继续递归渲染,从而还原出整棵嵌套结构
   * @param components - 组件节点数组
   * @returns 渲染出的 React 节点
   */
  function renderComponents(components: Component[]): ReactNode {
    return components.map(({ id, name, props, styles, children }) => {
      const config = componentConfig[name]
      // 组件未在物料配置中注册,跳过渲染
      if (!config) return null
      const elementProps = {
        key: id,
        id: id,
        name: name,
        // 先铺开物料默认属性,再用组件实例属性覆盖,保证实例配置优先级更高
        ...config.defaultProps,
        ...props,
        styles,
      }

      // dev 是编辑态下使用的组件实现(带 data-component-id 等编辑能力),缺失则无法在画布渲染
      if (!config?.dev) {
        return null
      }

      // 用 dev 组件动态创建元素,第三个参数递归渲染子组件
      return createElement(config.dev, { ...elementProps }, renderComponents(children || []))
    })
  }

  /**
   * 鼠标悬浮:借助事件冒泡路径,从最内层向外查找带 data-component-id 的 DOM,定位到具体组件
   * @param e - 鼠标事件
   */
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

  /**
   * 鼠标移出画布,清空悬浮组件,隐藏悬浮遮罩
   */
  const handleMouseLeave: MouseEventHandler = () => {
    setHoveredComponentId(undefined)
  }

  /**
   * 点击:同样沿 composedPath 冒泡查找 data-component-id,将命中的组件设为当前选中组件
   * @param e - 鼠标事件
   */
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
      className='h-full edit-area'
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 悬浮遮罩:仅当有悬浮组件、且它不是当前选中组件时显示,避免与选中遮罩重叠 */}
      {hoveredComponentId && hoveredComponentId !== curComponentId && (
        <HoverMask
          containerClassName='edit-area'
          portalWrapperClassName='portal-wrapper'
          componentId={hoveredComponentId}
        />
      )}
      {/* 选中遮罩:存在当前选中组件时显示,带删除、面包屑等操作 */}
      {curComponentId && (
        <SelectedMask
          containerClassName='edit-area'
          portalWrapperClassName='portal-wrapper'
          componentId={curComponentId}
        />
      )}
      {renderComponents(components)}
      {/* 遮罩通过 Portal 挂载到此容器,与被渲染的组件树同处画布内 */}
      <div className='portal-wrapper'></div>
    </div>
  )
}
