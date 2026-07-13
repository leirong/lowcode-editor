/**
 * @file 组件树状态管理:维护页面的组件树、当前选中组件,并提供增删改查方法。
 * 使用 zustand + persist,组件树会持久化到 localStorage,刷新后不丢失。
 */
import { CSSProperties } from "react"
import { StateCreator, create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * 低代码组件的 props / styles 由用户在运行时配置,天然是动态结构,此处保留 any 逃逸口。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentProps = Record<string, any>

/** 组件树中的单个节点 */
export interface Component {
  /** 组件唯一标识 */
  id: number
  /** 物料名(对应 componentConfig 的 key) */
  name: string
  /** 中文描述,用于大纲/展示 */
  desc: string
  /** 用户配置的属性及事件动作 */
  props: ComponentProps
  /** 内联样式 */
  styles?: CSSProperties
  /** 子组件(容器类物料才有) */
  children?: Component[]
  /** 父组件 id,便于删除时定位 */
  parentId?: number
}

interface State {
  /** 当前选中组件的 id */
  curComponentId?: number | null
  /** 当前选中组件对象 */
  curComponent: Component | null
  /** 整棵组件树(根为 Page) */
  components: Component[]
}

interface Action {
  /** 新增组件(可指定父级) */
  addComponent: (component: Component, parentId?: number) => void
  /** 删除组件 */
  deleteComponent: (componentId: number) => void
  /** 更新属性 */
  updateComponentProps: (componentId: number, props: ComponentProps) => void
  updateComponentStyles: (
    componentId: number,
    styles: CSSProperties,
    /** 是否整体替换样式(否则为合并) */
    replace?: boolean
  ) => void
  /** 设置当前选中组件 */
  setCurComponentId: (componentId: number | null) => void
}

/**
 * zustand store 的 StateCreator,组合 State 与 Action,定义组件树的初始状态与全部操作方法。
 * @param set - zustand 的状态更新函数
 * @param get - zustand 的状态读取函数
 * @returns 包含初始状态与各 action 的 store 对象
 */
const creator: StateCreator<Action & State> = (set, get) => ({
  curComponentId: null,
  curComponent: null,
  // 设置选中组件时,同步根据 id 从树中查出对应组件对象
  setCurComponentId: (componentId) =>
    set((state) => ({
      curComponent: getComponentById(componentId, state.components),
      curComponentId: componentId,
    })),
  // 初始组件树只有一个根节点 Page
  components: [{ id: 1, name: "Page", props: {}, desc: "页面" }],
  addComponent: (component, parentId) =>
    set((state) => {
      // 指定了父级则挂到父级的 children 下,否则作为顶层组件
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components)
        if (parentComponent) {
          component.parentId = parentId
          if (parentComponent.children) {
            parentComponent.children.push(component)
          } else {
            parentComponent.children = [component]
          }
        }
        return { components: [...state.components] }
      }
      return { components: [...state.components, component] }
    }),
  deleteComponent: (componentId) => {
    if (!componentId) return
    const component = getComponentById(componentId, get().components)
    // 从父组件的 children 中过滤掉该组件
    if (component?.parentId) {
      const parentComponent = getComponentById(
        component.parentId,
        get().components
      )
      if (parentComponent) {
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        )
        set({ components: [...get().components] })
      }
    }
  },
  updateComponentProps: (componentId, props) => {
    set((state) => {
      const component = getComponentById(componentId, state.components)
      if (component) {
        // 合并新旧 props
        component.props = { ...component.props, ...props }
        return { components: [...state.components] }
      }
      return { components: [...state.components] }
    })
  },
  updateComponentStyles: (componentId, styles, replace) => {
    set((state) => {
      const component = getComponentById(componentId, state.components)
      if (component) {
        // replace 为 true 时整体替换(用于 CSS 编辑器覆盖),否则与原样式合并
        component.styles = replace
          ? { ...styles }
          : { ...(component.styles || {}), ...styles }
        return { components: [...state.components] }
      }
      return { components: [...state.components] }
    })
  },
})

/** persist 中间件:以 name 为 key 将组件树缓存到 localStorage */
export const useComponentsStore = create<Action & State>()(
  persist(creator, {
    name: "lowcode-editor-store",
  })
)

/**
 * 在组件树中按 id 递归查找组件,找不到返回 null
 * @param id - 目标组件的 id,为空时直接返回 null
 * @param components - 待查找的组件树(或子树)
 * @returns 匹配的组件对象,未找到时返回 null
 */
export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) return null

  for (const component of components) {
    if (component.id == id) return component
    // 深度优先遍历子树
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children)
      if (result !== null) return result
    }
  }
  return null
}
