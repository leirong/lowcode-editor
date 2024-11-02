import { create } from "zustand"
import PageDev from "../components/material/page/dev"
import ContainerDev from "../components/material/container/dev"
import ButtonDev from "../components/material/button/dev"

import PageProd from "../components/material/page/prod"
import ContainerProd from "../components/material/container/prod"
import ButtonProd from "../components/material/button/prod"

export interface ComponentSetter {
  name: string
  label: string
  type: string
  [key: string]: any
}

export interface ComponentConfig {
  name: string
  defaultProps: Record<string, any>
  desc: string
  setter?: ComponentSetter[]
  stylesSetter?: ComponentSetter[]
  dev: any
  prod: any
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
      dev: PageDev,
      prod: PageProd,
    },
    Container: {
      name: "Container",
      defaultProps: {},
      desc: "容器",
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: "Button",
      defaultProps: {
        type: "primary",
        text: "按钮",
      },
      setter: [
        {
          name: "type",
          label: "按钮类型",
          type: "select",
          options: [
            {
              label: "主按钮",
              value: "primary",
            },
            {
              label: "次按钮",
              value: "default",
            },
            {
              label: "虚线按钮",
              value: "dashed",
            },
            {
              label: "文本按钮",
              value: "text",
            },
            {
              label: "链接按钮",
              value: "link",
            },
          ],
        },
        {
          name: "text",
          label: "文本",
          type: "input",
        },
      ],
      stylesSetter: [
        {
          name: "width",
          label: "宽度",
          type: "inputNumber",
        },
        {
          name: "height",
          label: "高度",
          type: "inputNumber",
        },
      ],
      desc: "按钮",
      dev: ButtonDev,
      prod: ButtonProd,
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
