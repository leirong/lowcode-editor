import { Button, Collapse } from "antd"
import { useComponentConfigStore } from "../../../stores/component-config"
import { useComponentsStore } from "../../../stores/components"
import ActionModal from "../action-modal"
import { useState } from "react"
import { GoToLinkConfig } from "./actions/go-to-link"
import { ShowMessageConfig } from "./actions/show-message"
import { DeleteOutlined } from "@ant-design/icons"

export default function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [visible, setVisible] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<string>()

  if (!curComponentId || !curComponent) return null

  const { events = [] } = componentConfig[curComponent.name]

  if (!events.length) return null

  const onOk = (config: GoToLinkConfig | ShowMessageConfig) => {
    if (!currentEvent) {
      return
    }
    updateComponentProps(curComponent.id, {
      [currentEvent]: {
        actions: [...(curComponent.props[currentEvent]?.actions || []), config],
      },
    })
    setVisible(false)
  }

  const onCancel = () => {
    setVisible(false)
  }

  const deleteAction = (eventName: string, index: number) => {
    updateComponentProps(curComponent.id, {
      [eventName]: {
        actions: curComponent.props[eventName]?.actions?.filter(
          (_: any, i: number) => i !== index
        ),
      },
    })
  }

  const items = events.map(({ name, label }) => {
    return {
      key: name,
      label: (
        <div className="flex justify-between leading-[30px]">
          {label}
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentEvent(name)
              setVisible(true)
            }}
          >
            添加动作
          </Button>
        </div>
      ),
      children: (
        <div>
          {curComponent.props[name]?.actions?.map(
            (action: GoToLinkConfig | ShowMessageConfig, index: number) => {
              return (
                <div>
                  {action.type === "goToLink" && (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">跳转链接</div>
                      <div>{action.url}</div>
                      <DeleteOutlined
                        className="absolute top-[10px] right-[10px] cursor-pointer"
                        onClick={() => deleteAction(name, index)}
                      />
                    </div>
                  )}
                  {action.type === "showMessage" && (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">消息弹窗</div>
                      <div>{action.config.type}</div>
                      <div>{action.config.text}</div>
                      <DeleteOutlined
                        className="absolute top-[10px] right-[10px] cursor-pointer"
                        onClick={() => deleteAction(name, index)}
                      />
                    </div>
                  )}
                </div>
              )
            }
          )}
        </div>
      ),
    }
  })

  return (
    <div className="px-[10px]">
      <Collapse
        className="mb-[10px]"
        items={items}
        defaultActiveKey={componentConfig[curComponent.name].events?.map(
          (item) => item.name
        )}
      />
      {currentEvent && (
        <ActionModal visible={visible} onOk={onOk} onCancel={onCancel} />
      )}
    </div>
  )
}
