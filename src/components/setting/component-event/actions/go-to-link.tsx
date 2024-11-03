import { Form, Input } from "antd"
import { useComponentsStore } from "../../../../stores/components"
import { useState } from "react"
const TextArea = Input.TextArea

export interface GoToLinkConfig {
  type: "goToLink"
  url: string
}
interface GoToLinkProps {
  value?: string
  onChange?: (value: GoToLinkConfig) => void
}
const GoToLink = ({ value, onChange }: GoToLinkProps) => {
  const { curComponentId, curComponent } = useComponentsStore()

  if (!curComponentId || !curComponent) return null

  const [url, setUrl] = useState(value)

  const handleChange = (e: { target: { value: any } }) => {
    const _url = e.target.value
    setUrl(_url)
    onChange?.({
      type: "goToLink",
      url: _url,
    })
  }

  return (
    <div className="flex items-center justify-center mt-[10px]">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ width: 600 }}
      >
        <Form.Item label="链接">
          <TextArea value={url} onChange={handleChange} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default GoToLink
