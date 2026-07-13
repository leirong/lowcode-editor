/**
 * @file Form 物料的编辑态(dev)组件:画布内展示的表单。
 * 仅接受 FormItem 子物料拖入,并从子节点 props 提取表单项;编辑态下输入控件禁用交互(pointerEvents:none)。
 */
import { Form as AntdForm, DatePicker, Input } from "antd"
import { useItemDrop } from "../useItemDrop"
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

/** 从 FormItem 子节点上读取的表单项配置字段 */
interface FormItemProps {
  id: number
  label: string
  name: string
  type: string
  /** 校验规则,'required' 表示必填 */
  rules?: string
}
/**
 * Form 物料的编辑态(dev)组件,仅接受 FormItem 拖入并从子节点提取表单项
 * @param props - 组件属性
 * @param props.id - 组件 id
 * @param props.name - 组件名称
 * @param props.children - 子节点(FormItem)
 * @param props.onFinish - 表单提交回调
 */
export const Form = ({ id, name, children, onFinish }: FormProps) => {
  const [form] = AntdForm.useForm()

  // 允许 FormItem 拖入本表单作为表单项
  const { canDrop, drop } = useItemDrop(["FormItem"], id)

  const divRef = useRef<HTMLDivElement>(null)

  // 让表单自身可被拖动(移动到其他容器)
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  })

  useEffect(() => {
    // 同一 DOM 同时作为拖入目标(drop)和可拖动源(drag)
    drop(divRef)
    drag(divRef)
  }, [])

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
