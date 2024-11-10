import { create } from "zustand"
import PageDev from "../components/material/page/dev"
import ContainerDev from "../components/material/container/dev"
import ButtonDev from "../components/material/button/dev"
import ModalDev from "../components/material/modal/dev"
import TableDev from "../components/material/table/dev"
import TableColumnDev from "../components/material/table-column/dev"

import PageProd from "../components/material/page/prod"
import ContainerProd from "../components/material/container/prod"
import ButtonProd from "../components/material/button/prod"
import ModalProd from "../components/material/modal/prod"
import TableProd from "../components/material/table/prod"
import TableColumnProd from "../components/material/table-column/prod"

export interface ComponentSetter {
  name: string
  label: string
  type: string
  [key: string]: any
}

export interface ComponentEvent {
  name: string
  label: string
}

export interface ComponentMethod {
  name: string
  label: string
}

export interface ComponentConfig {
  name: string
  defaultProps: Record<string, any>
  desc: string
  setter?: ComponentSetter[]
  stylesSetter?: ComponentSetter[]
  events?: ComponentEvent[]
  methods?: ComponentMethod[]
  dev: any
  prod: any
  accept?: ComponentConfig["name"][]
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
      accept: ["Container", "Button", "Modal", "Table"],
    },
    Container: {
      name: "Container",
      defaultProps: {},
      desc: "容器",
      dev: ContainerDev,
      prod: ContainerProd,
      accept: ["Button", "Modal", "Container", "Table"],
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
      events: [
        {
          name: "onClick",
          label: "点击事件",
        },
        {
          name: "onDoubleClick",
          label: "双击事件",
        },
      ],
      desc: "按钮",
      dev: ButtonDev,
      prod: ButtonProd,
    },
    Modal: {
      name: "Modal",
      defaultProps: {
        title: "弹窗",
      },
      setter: [
        {
          name: "title",
          label: "标题",
          type: "input",
        },
      ],
      stylesSetter: [],
      events: [
        {
          name: "onOk",
          label: "确认事件",
        },
        {
          name: "onCancel",
          label: "取消事件",
        },
      ],
      methods: [
        {
          name: "open",
          label: "打开弹窗",
        },
        {
          name: "close",
          label: "关闭弹窗",
        },
      ],
      desc: "弹窗",
      dev: ModalDev,
      prod: ModalProd,
      accept: ["Button", "Container", "Table"],
    },
    Table: {
      name: "Table",
      defaultProps: {},
      desc: "表格",
      dev: TableDev,
      prod: TableProd,
      accept: ["TableColumn"],
      setter: [
        {
          name: "url",
          label: "接口地址",
          type: "input",
        },
      ],
    },
    TableColumn: {
      name: "TableColumn",
      defaultProps: {
        dataIndex: `col_${new Date().getTime()}`,
        title: "列名",
      },
      desc: "表格列",
      dev: TableColumnDev,
      prod: TableColumnProd,
      setter: [
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            {
              label: "文本",
              value: "text",
            },
            {
              label: "日期",
              value: "date",
            },
          ],
        },
        {
          name: "title",
          label: "标题",
          type: "input",
        },
        {
          name: "dataIndex",
          label: "字段",
          type: "input",
        },
      ],
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
