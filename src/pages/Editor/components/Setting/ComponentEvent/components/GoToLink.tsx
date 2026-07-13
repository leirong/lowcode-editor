/**
 * @file 「跳转链接」动作的配置表单:配置事件触发时跳转的目标 URL。
 * 预览态触发时,Preview 通过 window.location.href = url 执行跳转。
 */
import { Form, Input } from "antd"
import { useComponentsStore } from "@/stores/components"
import { useState } from "react"
const TextArea = Input.TextArea

export interface GoToLinkConfig {
  type: "goToLink"
  /** 跳转目标地址 */
  url: string
}
interface GoToLinkProps {
  /** 已保存的链接,用于回填 */
  value?: string
  onChange?: (value: GoToLinkConfig) => void
}
/**
 * 「跳转链接」动作的配置表单
 * @param props - 组件属性
 * @param props.value - 已保存的链接,用于回填
 * @param props.onChange - 配置变更回调
 */
export const GoToLink = ({ value, onChange }: GoToLinkProps) => {
  const { curComponentId, curComponent } = useComponentsStore()

  const [url, setUrl] = useState(value)

  if (!curComponentId || !curComponent) return null

  /**
   * 输入变更时同步本地状态并回传配置
   * @param e - 输入框变更事件,e.target.value 为最新链接
   */
  const handleChange = (e: { target: { value: string } }) => {
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
