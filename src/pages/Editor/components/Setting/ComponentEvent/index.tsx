import { Button, Collapse } from 'antd'
import { useComponentConfigStore } from '@/stores/componentConfig'
import { getComponentById, useComponentsStore } from '@/stores/components'
import { ActionModal, ActionConfig } from '../ActionModal'
import { useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

/**
 * 事件设置面板:为当前组件配置事件(如 onClick),
 * 每个事件可绑定多个动作(action),动作类型支持
 * 跳转链接 / 消息弹窗 / 组件方法调用 / 自定义 JS,通过 ActionModal 弹窗新增或编辑。
 */
export function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps, components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  // 控制动作配置弹窗的显隐
  const [visible, setVisible] = useState(false)

  // 当前正在编辑的事件名(如 onClick)
  const [currentEvent, setCurrentEvent] = useState<string>()

  // 当前正在编辑的动作;为空表示新增动作
  const [action, setAction] = useState<ActionConfig>()

  // 正在编辑的动作在该事件动作列表中的下标
  const [curActionIndex, setCurActionIndex] = useState<number>()

  if (!curComponentId || !curComponent) return null

  // 该组件配置支持的事件列表
  const { events = [] } = componentConfig[curComponent.name]

  if (!events.length) return null

  /**
   * 弹窗确认:根据是否存在 action 区分「修改」与「新增」,写回组件 props
   * @param config - 动作配置
   */
  const onOk = (config: ActionConfig) => {
    if (!currentEvent) {
      return
    }
    if (action) {
      // 修改:替换对应下标的动作
      updateComponentProps(curComponent.id, {
        [currentEvent]: {
          actions: curComponent.props[currentEvent]?.actions.map((item: ActionConfig, index: number) => {
            return index === curActionIndex ? config : item
          }),
        },
      })
    } else {
      // 新增:追加到该事件的动作列表末尾
      updateComponentProps(curComponent.id, {
        [currentEvent]: {
          actions: [...(curComponent.props[currentEvent]?.actions || []), config],
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

  /**
   * 删除某事件下指定下标的动作
   * @param eventName - 事件名
   * @param index - 动作在该事件动作列表中的下标
   */
  const deleteAction = (eventName: string, index: number) => {
    updateComponentProps(curComponent.id, {
      [eventName]: {
        actions: curComponent.props[eventName]?.actions?.filter((_: ActionConfig, i: number) => i !== index),
      },
    })
  }

  /**
   * 编辑动作:回填选中的动作并打开弹窗
   * @param action - 待编辑的动作配置
   */
  const editAction = (action: ActionConfig) => {
    setAction(action)
    setVisible(true)
  }

  // 每个事件渲染成一个折叠面板:标题带「添加动作」按钮,内容列出已配置的动作卡片
  const items = events.map(({ name, label }) => {
    return {
      key: name,
      label: (
        <div className='flex justify-between leading-[30px]'>
          {label}
          <Button
            type='primary'
            onClick={(e) => {
              // 阻止冒泡避免触发折叠面板展开;标记当前事件并打开新增弹窗
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
          {/* 遍历该事件已绑定的动作,按动作类型渲染不同的展示卡片,每张卡片带编辑/删除入口 */}
          {curComponent.props[name]?.actions?.map((action: ActionConfig, index: number) => {
            return (
              <div key={index}>
                {action.type === 'goToLink' && (
                  <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                    <div className='text-[blue]'>跳转链接</div>
                    <div>{action.url}</div>
                    <EditOutlined
                      className='absolute top-[10px] right-[30px] cursor-pointer'
                      onClick={() => {
                        editAction(action)
                        setCurActionIndex(index)
                      }}
                    />
                    <DeleteOutlined
                      className='absolute top-[10px] right-[10px] cursor-pointer'
                      onClick={() => deleteAction(name, index)}
                    />
                  </div>
                )}
                {action.type === 'showMessage' && (
                  <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                    <div className='text-[blue]'>消息弹窗</div>
                    <div>{action.config.type}</div>
                    <div>{action.config.text}</div>
                    <EditOutlined
                      className='absolute top-[10px] right-[30px] cursor-pointer'
                      onClick={() => {
                        editAction(action)
                        setCurActionIndex(index)
                      }}
                    />
                    <DeleteOutlined
                      className='absolute top-[10px] right-[10px] cursor-pointer'
                      onClick={() => deleteAction(name, index)}
                    />
                  </div>
                )}
                {action.type === 'customJS' && (
                  <div
                    key='customJS'
                    className='border border-[#aaa] m-[10px] p-[10px] relative'
                  >
                    <div className='text-[blue]'>自定义 JS</div>
                    <EditOutlined
                      className='absolute top-[10px] right-[30px] cursor-pointer'
                      onClick={() => {
                        editAction(action)
                        setCurActionIndex(index)
                      }}
                    />
                    <DeleteOutlined
                      className='absolute top-[10px] right-[10px] cursor-pointer'
                      onClick={() => deleteAction(name, index)}
                    />
                  </div>
                )}
                {action.type === 'componentMethod' && (
                  <div
                    key='componentMethod'
                    className='border border-[#aaa] m-[10px] p-[10px] relative'
                  >
                    <div className='text-[blue]'>组件方法</div>
                    <div>{getComponentById(action.config.componentId, components)?.desc}</div>
                    <div>{action.config.componentId}</div>
                    <div>{action.config.method}</div>
                    <EditOutlined
                      className='absolute top-[10px] right-[30px] cursor-pointer'
                      onClick={() => {
                        editAction(action)
                        setCurActionIndex(index)
                      }}
                    />
                    <DeleteOutlined
                      className='absolute top-[10px] right-[10px] cursor-pointer'
                      onClick={() => deleteAction(name, index)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ),
    }
  })

  return (
    <div className='px-[10px]'>
      <Collapse
        className='mb-[10px]'
        items={items}
        defaultActiveKey={componentConfig[curComponent.name].events?.map((item) => item.name)}
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
