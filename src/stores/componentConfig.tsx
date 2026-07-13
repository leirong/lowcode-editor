import { create } from "zustand"
import { ComponentType } from "react"
import { Page as PageDev } from "../materials/Page/dev"
import { Container as ContainerDev } from "../materials/Container/dev"
import { Button as ButtonDev } from "../materials/Button/dev"
import { Modal as ModalDev } from "../materials/Modal/dev"
import { Table as TableDev } from "../materials/Table/dev"
import { TableColumn as TableColumnDev } from "../materials/TableColumn/dev"
import { Form as FormDev } from "../materials/Form/dev"
import { FormItem as FormItemDev } from "../materials/FormItem/dev"

import { Page as PageProd } from "../materials/Page/prod"
import { Container as ContainerProd } from "../materials/Container/prod"
import { Button as ButtonProd } from "../materials/Button/prod"
import { Modal as ModalProd } from "../materials/Modal/prod"
import { Table as TableProd } from "../materials/Table/prod"
import { TableColumn as TableColumnProd } from "../materials/TableColumn/prod"
import { Form as FormProd } from "../materials/Form/prod"
import { FormItem as FormItemProd } from "../materials/FormItem/prod"

export interface ComponentSetter {
  name: string
  label: string
  type: string
  // setter 支持任意扩展字段(options、placeholder 等),保留 any 逃逸口。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  defaultProps: Record<string, unknown>
  desc: string
  setter?: ComponentSetter[]
  stylesSetter?: ComponentSetter[]
  events?: ComponentEvent[]
  methods?: ComponentMethod[]
  // 物料的 dev/prod 渲染组件,props 形态随物料而异。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dev: ComponentType<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prod: ComponentType<any>
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
