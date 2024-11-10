import { Form as AntdForm, DatePicker, Input } from "antd"
import dayjs from "dayjs"
import React, {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react"
interface FormProps extends CommonComponentProps, PropsWithChildren {
  onFinish: (values: any) => void
}
export interface FormRef {
  submit: () => void
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
    return React.Children.map(children, (item: any) => {
      return {
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
        rules: item.props?.rules,
      }
    })
  }, [children])

  async function save(values: any) {
    Object.keys(values).forEach((key) => {
      if (dayjs.isDayjs(values[key])) {
        values[key] = values[key].format("YYYY-MM-DD")
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
      {formItems.map((item: any) => {
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
