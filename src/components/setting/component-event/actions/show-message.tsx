import { Form, Input, Select } from "antd"
import { useComponentsStore } from "../../../../stores/components"
import { useState } from "react"

export interface ShowMessageConfig {
  type: "showMessage"
  config: {
    type: "success" | "error"
    text: string
  }
}

interface ShowMessageProps {
  value?: ShowMessageConfig["config"]
  onChange?: (value: ShowMessageConfig) => void
}

const ShowMessage = ({ value, onChange }: ShowMessageProps) => {
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

export default ShowMessage
