import { create } from "zustand"
// import { Container, Button, Page } from "../components"
import Page from "../components/material/page"
import Container from "../components/material/container"
import Button from "../components/material/button"

export interface ComponentConfig {
  name: string
  defaultProps: Record<string, any>
  desc: string
  component: any
}

interface State {
  componentConfig: { [key: string]: ComponentConfig }
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Page: {
      name: "Page",
      defaultProps: {},
      desc: "页面",
      component: Page,
    },
    Container: {
      name: "Container",
      defaultProps: {},
      desc: "容器",
      component: Container,
    },
    Button: {
      name: "Button",
      defaultProps: {
        type: "primary",
        text: "按钮",
      },
      desc: "按钮",
      component: Button,
    },
  },
  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      }
    }),
}))