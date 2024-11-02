import { create } from "zustand"
export interface Component {
  id: number
  name: string
  desc: string
  props: any
  children?: Component[]
  parentId?: number
}

interface State {
  curComponentId?: number | null
  curComponent: Component | null
  components: Component[]
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void
  deleteComponent: (componentId: number) => void
  updateComponent: (componentId: number, props: any) => void
  setCurComponentId: (componentId: number | null) => void
}

export const useComponentsStore = create<Action & State>((set, get) => ({
  curComponentId: null,
  curComponent: null,
  setCurComponentId: (componentId) =>
    set((state) => ({
      curComponent: getComponentById(componentId, state.components),
      curComponentId: componentId,
    })),
  components: [{ id: 1, name: "Page", props: {}, desc: "页面" }],
  addComponent: (component: Component, parentId?: number) =>
    set((state) => {
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
  deleteComponent: (componentId: number) => {
    if (!componentId) return
    const component = getComponentById(componentId, get().components)
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
  updateComponent: (componentId: number, props: any) => {
    set((state) => {
      const component = getComponentById(componentId, state.components)
      if (component) {
        component.props = { ...component.props, ...props }
        return { components: [...state.components] }
      }
      return { components: [...state.components] }
    })
  },
}))

export function getComponentById(
  id: number | null,
  components: Component[]
): Component | null {
  if (!id) return null

  for (const component of components) {
    if (component.id == id) return component
    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children)
      if (result !== null) return result
    }
  }
  return null
}
