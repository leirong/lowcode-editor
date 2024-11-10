import { create } from "zustand"
import PageDev from "../components/material/page/dev"
import ContainerDev from "../components/material/container/dev"
import ButtonDev from "../components/material/button/dev"
import ModalDev from "../components/material/modal/dev"
import TableDev from "../components/material/table/dev"
import TableColumnDev from "../components/material/table-column/dev"
import FormDev from "../components/material/form/dev"
import FormItemDev from "../components/material/form-item/dev"

import PageProd from "../components/material/page/prod"
import ContainerProd from "../components/material/container/prod"
import ButtonProd from "../components/material/button/prod"
import ModalProd from "../components/material/modal/prod"
import TableProd from "../components/material/table/prod"
import TableColumnProd from "../components/material/table-column/prod"
import FormProd from "../components/material/form/prod"
import FormItemProd from "../components/material/form-item/prod"

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
      accept: ["Container", "Button", "Modal", "Table", "Form"],
    },
    Container: {
      name: "Container",
      defaultProps: {},
      desc: "容器",
      dev: ContainerDev,
      prod: ContainerProd,
      accept: ["Button", "Modal", "Container", "Table", "Form"],
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
      accept: ["Button", "Container", "Table", "Form"],
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
    Form: {
      name: "Form",
      defaultProps: {},
      desc: "表单",
      setter: [
        {
          name: "title",
          label: "标题",
          type: "input",
        },
      ],
      events: [
        {
          name: "onFinish",
          label: "提交事件",
        },
      ],
      methods: [
        {
          name: "submit",
          label: "提交",
        },
      ],
      dev: FormDev,
      prod: FormProd,
    },
    FormItem: {
      name: "FormItem",
      defaultProps: {
        name: new Date().getTime(),
        label: "姓名",
        type: "input",
        rules: {
          required: false,
        },
      },
      desc: "表单项",
      dev: FormItemDev,
      prod: FormItemProd,
      setter: [
        {
          name: "type",
          label: "类型",
          type: "select",
          options: [
            {
              label: "输入框",
              value: "input",
            },
            {
              label: "日期",
              value: "date",
            },
          ],
        },
        {
          name: "label",
          label: "标题",
          type: "input",
        },
        {
          name: "name",
          label: "字段",
          type: "input",
        },
        {
          name: "rules",
          label: "校验",
          type: "select",
          options: [
            {
              label: "必填",
              value: "required",
            },
          ],
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
