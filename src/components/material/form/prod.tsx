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
export interface FormRef {
  submit: () => void
}
interface FormItemProps {
  id: number
  label: string
  name: string
  type: string
  rules?: string
}
const Form: ForwardRefRenderFunction<FormRef, FormProps> = (
  { children, onFinish },
  ref
) => {
  const [form] = AntdForm.useForm()

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

export default forwardRef(Form)
