/**
 * @file 物料注册表:集中管理所有可用物料的元信息与渲染组件。
 * 每个物料同时登记 dev(编辑器画布内的可视化编辑版本)与 prod(预览/运行时的真实渲染版本)两套组件,
 * 并声明其默认属性、属性/样式配置项(setter)、可绑定事件、可被调用的方法,以及允许拖入的子物料(accept)。
 */
import { create } from 'zustand'
import { ComponentType } from 'react'
import {
  PageDev,
  ContainerDev,
  ButtonDev,
  ModalDev,
  TableDev,
  TableColumnDev,
  FormDev,
  FormItemDev,
  PageProd,
  ContainerProd,
  ButtonProd,
  ModalProd,
  TableProd,
  TableColumnProd,
  FormProd,
  FormItemProd,
} from '@/materials'
import { randomId } from '@/utils'

/** 属性/样式配置项:描述设置面板里如何渲染某个属性的编辑控件 */
export interface ComponentSetter {
  /** 对应组件 props 的字段名 */
  name: string
  /** 表单项标题 */
  label: string
  /** 控件类型,如 input / select / inputNumber */
  type: string
  /**
   * setter 支持任意扩展字段(options、placeholder 等),保留 any 逃逸口。
   */
  [key: string]: any
}

/** 组件可绑定的事件(如 onClick),在事件设置 Tab 中展示 */
export interface ComponentEvent {
  /** 事件名(对应 props 字段) */
  name: string
  /** 事件中文名 */
  label: string
}

/** 组件对外暴露、可被其他组件事件动作调用的方法(如 Modal 的 open) */
export interface ComponentMethod {
  /** 方法名 */
  name: string
  /** 方法中文名 */
  label: string
}

/** 单个物料的完整配置 */
export interface ComponentConfig {
  /** 物料唯一名(注册表的 key) */
  name: string
  /** 拖入画布时的默认属性 */
  defaultProps: Record<string, unknown>
  /** 中文描述 */
  desc: string
  /** 属性配置项 */
  setter?: ComponentSetter[]
  /** 样式配置项 */
  stylesSetter?: ComponentSetter[]
  /** 可绑定事件 */
  events?: ComponentEvent[]
  /** 可被调用的方法 */
  methods?: ComponentMethod[]
  /**
   * 物料的 dev/prod 渲染组件,props 形态随物料而异。
   */
  dev: ComponentType<any>
  prod: ComponentType<any>
  /** 允许作为子级拖入的物料名(容器类物料才有) */
  accept?: ComponentConfig['name'][]
}

interface State {
  /** 物料名 → 配置 */
  componentConfig: { [key: string]: ComponentConfig }
}

interface Action {
  /** 运行时动态注册新物料 */
  registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Page: {
      name: 'Page',
      defaultProps: {},
      desc: '页面',
      dev: PageDev,
      prod: PageProd,
      accept: ['Container', 'Button', 'Modal', 'Table', 'Form'],
    },
    Container: {
      name: 'Container',
      defaultProps: {},
      desc: '容器',
      dev: ContainerDev,
      prod: ContainerProd,
      accept: ['Button', 'Modal', 'Container', 'Table', 'Form'],
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      setter: [
        {
          name: 'type',
          label: '按钮类型',
          type: 'select',
          options: [
            {
              label: '主按钮',
              value: 'primary',
            },
            {
              label: '次按钮',
              value: 'default',
            },
            {
              label: '虚线按钮',
              value: 'dashed',
            },
            {
              label: '文本按钮',
              value: 'text',
            },
            {
              label: '链接按钮',
              value: 'link',
            },
          ],
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        },
      ],
      stylesSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
      events: [
        {
          name: 'onClick',
          label: '点击事件',
        },
        {
          name: 'onDoubleClick',
          label: '双击事件',
        },
      ],
      desc: '按钮',
      dev: ButtonDev,
      prod: ButtonProd,
    },
    Modal: {
      name: 'Modal',
      defaultProps: {
        title: '弹窗',
      },
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
      ],
      stylesSetter: [],
      events: [
        {
          name: 'onOk',
          label: '确认事件',
        },
        {
          name: 'onCancel',
          label: '取消事件',
        },
      ],
      methods: [
        {
          name: 'open',
          label: '打开弹窗',
        },
        {
          name: 'close',
          label: '关闭弹窗',
        },
      ],
      desc: '弹窗',
      dev: ModalDev,
      prod: ModalProd,
      accept: ['Button', 'Container', 'Table', 'Form'],
    },
    Table: {
      name: 'Table',
      defaultProps: {},
      desc: '表格',
      dev: TableDev,
      prod: TableProd,
      accept: ['TableColumn'],
      setter: [
        {
          name: 'url',
          label: '接口地址',
          type: 'input',
        },
      ],
    },
    TableColumn: {
      name: 'TableColumn',
      defaultProps: {
        get dataIndex() {
          return randomId()
        },
        title: '列名',
      },
      desc: '表格列',
      dev: TableColumnDev,
      prod: TableColumnProd,
      setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '文本',
              value: 'text',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
        {
          name: 'dataIndex',
          label: '字段',
          type: 'input',
        },
      ],
    },
    Form: {
      name: 'Form',
      defaultProps: {},
      desc: '表单',
      setter: [
        {
          name: 'title',
          label: '标题',
          type: 'input',
        },
      ],
      events: [
        {
          name: 'onFinish',
          label: '提交事件',
        },
      ],
      methods: [
        {
          name: 'submit',
          label: '提交',
        },
      ],
      dev: FormDev,
      prod: FormProd,
    },
    FormItem: {
      name: 'FormItem',
      defaultProps: {
        get name() {
          return randomId()
        },
        label: '姓名',
        type: 'input',
        rules: {
          required: false,
        },
      },
      desc: '表单项',
      dev: FormItemDev,
      prod: FormItemProd,
      setter: [
        {
          name: 'type',
          label: '类型',
          type: 'select',
          options: [
            {
              label: '输入框',
              value: 'input',
            },
            {
              label: '日期',
              value: 'date',
            },
          ],
        },
        {
          name: 'label',
          label: '标题',
          type: 'input',
        },
        {
          name: 'name',
          label: '字段',
          type: 'input',
        },
        {
          name: 'rules',
          label: '校验',
          type: 'select',
          options: [
            {
              label: '必填',
              value: 'required',
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
