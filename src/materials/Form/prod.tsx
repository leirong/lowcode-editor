/**
 * @file Form 物料的生产态(prod)组件:预览/运行时的真实表单。
 * 通过 forwardRef + useImperativeHandle 对外暴露 submit 方法,供事件动作(componentMethod)调用触发提交。
 */
import { Form as AntdForm, DatePicker, Input } from "antd"
import dayjs from "dayjs"
import React, {
  ForwardRefRenderFunction,
  PropsWithChildren,
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react"
interface FormProps extends CommonComponentProps, PropsWithChildren {
  onFinish: (values: Record<string, unknown>) => void
}
/** 对外暴露的表单方法 */
export interface FormRef {
  submit: () => void
}
/** 从 FormItem 子节点上读取的表单项配置字段 */
interface FormItemProps {
  id: number
  label: string
  name: string
  type: string
  /** 校验规则,'required' 表示必填 */
  rules?: string
}
const FormRender: ForwardRefRenderFunction<FormRef, FormProps> = (
  { children, onFinish },
  ref
) => {
  const [form] = AntdForm.useForm()

  // 暴露 submit 方法,让外部(如按钮的组件方法动作)可触发本表单提交
  useImperativeHandle(
    ref,
    () => {
      return {
        submit: () => {
          form.submit()
        },
      }
    },
    [form]
  )

  // 将 FormItem 子节点转换为表单项配置列表
  const formItems = useMemo(() => {
    return (
      React.Children.map(children, (item) => {
        const props = (item as ReactElement<FormItemProps>).props
        return {
          label: props?.label,
          name: props?.name,
          type: props?.type,
          id: props?.id,
          rules: props?.rules,
        }
      }) || []
    )
  }, [children])

  /**
   * 提交前把 dayjs 日期对象统一格式化为 YYYY-MM-DD 字符串,再回调 onFinish
   * @param values - 表单收集到的字段值
   * @returns {Promise<void>}
   */
  async function save(values: Record<string, unknown>) {
    Object.keys(values).forEach((key) => {
      if (dayjs.isDayjs(values[key])) {
        values[key] = (values[key] as dayjs.Dayjs).format("YYYY-MM-DD")
      }
    })

    onFinish(values)
  }

  return (
    <AntdForm
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      form={form}
      onFinish={save}
    >
      {formItems.map((item) => {
        return (
          <AntdForm.Item
            key={item.name}
            name={item.name}
            label={item.label}
            rules={
              item.rules === "required"
                ? [
                    {
                      required: true,
                      message: "不能为空",
                    },
                  ]
                : []
            }
          >
            {item.type === "input" && <Input />}
            {item.type === "date" && <DatePicker />}
          </AntdForm.Item>
        )
      })}
    </AntdForm>
  )
}

export const Form = forwardRef(FormRender)
