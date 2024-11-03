import { Button, Collapse } from "antd"
import { useComponentConfigStore } from "../../../stores/component-config"
import {
  getComponentById,
  useComponentsStore,
} from "../../../stores/components"
import ActionModal, { ActionConfig } from "../action-modal"
import { useState } from "react"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"

export default function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps, components } =
    useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [visible, setVisible] = useState(false)

  const [currentEvent, setCurrentEvent] = useState<string>()

  const [action, setAction] = useState<ActionConfig>()

  const [curActionIndex, setCurActionIndex] = useState<number>()

  if (!curComponentId || !curComponent) return null

  const { events = [] } = componentConfig[curComponent.name]

  if (!events.length) return null

  const onOk = (config: ActionConfig) => {
    if (!currentEvent) {
      return
    }
    if (action) {
      // 修改
      updateComponentProps(curComponent.id, {
        [currentEvent]: {
          actions: curComponent.props[currentEvent]?.actions.map(
            (item: ActionConfig, index: number) => {
              return index === curActionIndex ? config : item
            }
          ),
        },
      })
    } else {
      // 新增
      updateComponentProps(curComponent.id, {
        [currentEvent]: {
          actions: [
            ...(curComponent.props[currentEvent]?.actions || []),
            config,
          ],
        },
      })
    }

    setAction(undefined)

    setVisible(false)
  }

  const onCancel = () => {
    setAction(undefined)
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

  const editAction = (action: ActionConfig) => {
    setAction(action)
    setVisible(true)
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
            (action: ActionConfig, index: number) => {
              return (
                <div key={index}>
                  {action.type === "goToLink" && (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">跳转链接</div>
                      <div>{action.url}</div>
                      <EditOutlined
                        className="absolute top-[10px] right-[30px] cursor-pointer"
                        onClick={() => {
                          editAction(action)
                          setCurActionIndex(index)
                        }}
                      />
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
                      <EditOutlined
                        className="absolute top-[10px] right-[30px] cursor-pointer"
                        onClick={() => {
                          editAction(action)
                          setCurActionIndex(index)
                        }}
                      />
                      <DeleteOutlined
                        className="absolute top-[10px] right-[10px] cursor-pointer"
                        onClick={() => deleteAction(name, index)}
                      />
                    </div>
                  )}
                  {action.type === "customJS" && (
                    <div
                      key="customJS"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[blue]">自定义 JS</div>
                      <EditOutlined
                        className="absolute top-[10px] right-[30px] cursor-pointer"
                        onClick={() => {
                          editAction(action)
                          setCurActionIndex(index)
                        }}
                      />
                      <DeleteOutlined
                        className="absolute top-[10px] right-[10px] cursor-pointer"
                        onClick={() => deleteAction(name, index)}
                      />
                    </div>
                  )}
                  {action.type === "componentMethod" && (
                    <div
                      key="componentMethod"
                      className="border border-[#aaa] m-[10px] p-[10px] relative"
                    >
                      <div className="text-[blue]">组件方法</div>
                      <div>
                        {
                          getComponentById(
                            action.config.componentId,
                            components
                          )?.desc
                        }
                      </div>
                      <div>{action.config.componentId}</div>
                      <div>{action.config.method}</div>
                      <EditOutlined
                        className="absolute top-[10px] right-[30px] cursor-pointer"
                        onClick={() => {
                          editAction(action)
                          setCurActionIndex(index)
                        }}
                      />
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
        <ActionModal
          action={action}
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}
