import { Modal, Segmented } from "antd"
import { useEffect, useState } from "react"
import GoToLink, { GoToLinkConfig } from "../component-event/actions/go-to-link"
import ShowMessage, {
  ShowMessageConfig,
} from "../component-event/actions/show-message"
import CustomJS, { CustomJSConfig } from "../component-event/actions/custom-js"
import ComponentMethod, {
  ComponentMethodConfig,
} from "../component-event/actions/component-method"

export type ActionConfig =
  | GoToLinkConfig
  | ShowMessageConfig
  | CustomJSConfig
  | ComponentMethodConfig

interface ActionModalProps {
  visible: boolean
  action?: ActionConfig
  onOk: (config: ActionConfig) => void
  onCancel: () => void
}
export default function ActionModal(props: ActionModalProps) {
  const { visible, action, onOk, onCancel } = props

  const map = {
    goToLink: "访问链接",
    showMessage: "消息提示",
    componentMethod: "组件方法",
    customJS: "自定义 JS",
  }
  const [key, setKey] = useState<string>("访问链接")

  const [curConfig, setCurConfig] = useState<ActionConfig>()

  const handleOk = () => {
    if (!curConfig) return
    onOk(curConfig)
  }

  useEffect(() => {
    if (action) {
      setKey(map[action.type])
    }
  }, [action])

  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="添加"
      cancelText="取消"
    >
      <div className="h-[500px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={["访问链接", "消息提示", "组件方法", "自定义 JS"]}
        />
        {key === "访问链接" && (
          <GoToLink
            value={action?.type === "goToLink" ? action.url : ""}
            onChange={setCurConfig}
          />
        )}
        {key === "消息提示" && (
          <ShowMessage
            value={action?.type === "showMessage" ? action.config : undefined}
            onChange={setCurConfig}
          />
        )}
        {key === "组件方法" && (
          <ComponentMethod
            value={
              action?.type === "componentMethod" ? action.config : undefined
            }
            onChange={setCurConfig}
          />
        )}
        {key === "自定义 JS" && (
          <CustomJS
            value={action?.type === "customJS" ? action.code : ""}
            onChange={setCurConfig}
          />
        )}
      </div>
    </Modal>
  )
}
