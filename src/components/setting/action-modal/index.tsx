import { Modal, Segmented } from "antd"
import { useState } from "react"
import GoToLink, { GoToLinkConfig } from "../component-event/actions/go-to-link"
import ShowMessage, {
  ShowMessageConfig,
} from "../component-event/actions/show-message"

interface ActionModalProps {
  visible: boolean
  onOk: (config: GoToLinkConfig | ShowMessageConfig) => void
  onCancel: () => void
}
export default function ActionModal(props: ActionModalProps) {
  const { visible, onOk, onCancel } = props
  const [key, setKey] = useState<string>("访问链接")

  const [curConfig, setCurConfig] = useState<
    GoToLinkConfig | ShowMessageConfig
  >()

  const handleOk = () => {
    if (!curConfig) return
    onOk(curConfig)
  }

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
          options={["访问链接", "消息提示", "自定义 JS"]}
        />
        {key === "访问链接" && <GoToLink onChange={setCurConfig} />}
        {key === "消息提示" && <ShowMessage onChange={setCurConfig} />}
      </div>
    </Modal>
  )
}
