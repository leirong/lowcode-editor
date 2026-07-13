/**
 * @file 「消息提示」动作的配置表单:配置事件触发时弹出的提示类型(成功/失败)与文本。
 */
import { Form, Input, Select } from "antd"
import { useComponentsStore } from "@/stores"
import { useState } from "react"

export interface ShowMessageConfig {
  type: "showMessage"
  config: {
    /** 提示类型 */
    type: "success" | "error"
    /** 提示文本 */
    text: string
  }
}

interface ShowMessageProps {
  /** 已保存的配置,用于回填 */
  value?: ShowMessageConfig["config"]
  onChange?: (value: ShowMessageConfig) => void
}

/**
 * 「消息提示」动作的配置表单
 * @param props - 组件属性
 * @param props.value - 已保存的配置,用于回填
 * @param props.onChange - 配置变更回调
 */
export const ShowMessage = ({ value, onChange }: ShowMessageProps) => {
  const { curComponentId } = useComponentsStore()
  const [type, setType] = useState(value?.type || "success")
  const [text, setText] = useState(value?.text || "")
  if (!curComponentId) return null
  return (
    <div className="flex items-center justify-center mt-[10px]">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ width: 600 }}
      >
        <Form.Item label="类型">
          <Select
            options={[
              { label: "成功", value: "success" },
              { label: "失败", value: "error" },
            ]}
            onChange={(value) => {
              setType(value)
              onChange?.({
                type: "showMessage",
                config: {
                  type: value,
                  text,
                },
              })
            }}
            value={type}
          />
        </Form.Item>
        <Form.Item label="文本">
          <Input
            onChange={(e) => {
              setText(e.target.value)
              onChange?.({
                type: "showMessage",
                config: {
                  type,
                  text: e.target.value,
                },
              })
            }}
            value={text}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
