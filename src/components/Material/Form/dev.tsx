import { Form as AntdForm, DatePicker, Input } from "antd"
import { useItemDrop } from "../../../hooks/useItemDrop"
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { useDrag } from "react-dnd"
interface FormProps extends CommonComponentProps, PropsWithChildren {
  onFinish: (values: Record<string, unknown>) => void
}

interface FormItemProps {
  id: number
  label: string
  name: string
  type: string
  rules?: string
}
export const Form = ({ id, name, children, onFinish }: FormProps) => {
  const [form] = AntdForm.useForm()

  const { canDrop, drop } = useItemDrop(["FormItem"], id)

  const divRef = useRef<HTMLDivElement>(null)

  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  })

  useEffect(() => {
    drop(divRef)
    drag(divRef)
  }, [])

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

  return (
    <div
      className={`w-[100%] p-[20px] min-h-[100px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      ref={divRef}
      data-component-id={id}
    >
      <AntdForm
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        form={form}
        onFinish={(values) => onFinish?.(values)}
      >
        {formItems.map((item) => {
          return (
            <AntdForm.Item
              key={item.name}
              data-component-id={item.id}
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
              {item.type === "input" && (
                <Input style={{ pointerEvents: "none" }} />
              )}
              {item.type === "date" && (
                <DatePicker style={{ pointerEvents: "none" }} />
              )}
            </AntdForm.Item>
          )
        })}
      </AntdForm>
    </div>
  )
}
