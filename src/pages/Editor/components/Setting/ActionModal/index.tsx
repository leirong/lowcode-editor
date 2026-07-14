import { Modal, Segmented } from "antd"
import { useEffect, useState } from "react"
import { GoToLink, GoToLinkConfig } from "../ComponentEvent/components/GoToLink"
import {
  ShowMessage,
  ShowMessageConfig,
} from "../ComponentEvent/components/ShowMessage"
import { CustomJS, CustomJSConfig } from "../ComponentEvent/components/CustomJS"
import {
  ComponentMethod,
  ComponentMethodConfig,
} from "../ComponentEvent/components/ComponentMethod"

/** 动作配置的联合类型:四种动作各自的配置结构 */
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

const actionTypeLabels: Record<ActionConfig["type"], string> = {
  goToLink: "访问链接",
  showMessage: "消息提示",
  componentMethod: "组件方法",
  customJS: "自定义 JS",
}

/**
 * 新增/编辑事件动作的弹窗:用 Segmented 切换动作类型,
 * 根据类型渲染对应的配置表单(访问链接/消息提示/组件方法/自定义 JS)。
 * @param props - 弹窗属性(visible / action / onOk / onCancel)
 */
export function ActionModal(props: ActionModalProps) {
  const { visible, action, onOk, onCancel } = props

  // 动作类型到分段标签的映射,用于编辑时回填选中项
  // 当前选中的动作类型分段
  const [key, setKey] = useState<string>("访问链接")

  // 各子表单通过 onChange 收集到的当前动作配置
  const [curConfig, setCurConfig] = useState<ActionConfig>()

  /**
   * 点击确认时把当前配置回传给父组件
   */
  const handleOk = () => {
    if (!curConfig) return
    onOk(curConfig)
  }

  useEffect(() => {
    if (action) {
      // 根据外部传入的 action 回填当前选中的分段。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKey(actionTypeLabels[action.type])
      setCurConfig(action)
    } else if (visible) {
      setKey("访问链接")
      setCurConfig(undefined)
    }
  }, [action, visible])

  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      destroyOnHidden
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
        {/* 按选中的分段渲染对应动作的配置表单;编辑时用已保存的 action 回填初始值 */}
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
