/**
 * @file 「组件方法」动作的配置表单:选择目标组件及其暴露的方法(如 Modal.open、Form.submit)。
 * 预览态触发事件时,Preview 会通过组件 ref 调用所选方法。
 */
import { Form, Select, TreeSelect } from 'antd'
import { Component, getComponentById, useComponentsStore } from '@/stores/components'
import { useEffect, useState } from 'react'
import { useComponentConfigStore } from '@/stores/componentConfig'

export interface ComponentMethodConfig {
  type: 'componentMethod'
  config: {
    /** 目标组件 id */
    componentId: number
    /** 目标组件暴露的方法名 */
    method: string
  }
}

interface ComponentMethodProps {
  /** 已保存的配置,用于回填 */
  value?: ComponentMethodConfig['config']
  onChange?: (value: ComponentMethodConfig) => void
}

/**
 * 「组件方法」动作的配置表单
 * @param props - 组件属性
 * @param props.value - 已保存的配置,用于回填
 * @param props.onChange - 配置变更回调
 */
export const ComponentMethod = ({ value, onChange }: ComponentMethodProps) => {
  const { curComponentId, components } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  // 当前选中的目标组件对象,用于查出它支持哪些方法
  const [selectedComponent, setSelectedComponent] = useState<Component | null>()

  const [componentId, setComponentId] = useState<number>()

  const [method, setMethod] = useState<string>()

  useEffect(() => {
    if (value) {
      // 从外部传入的 value(已保存的配置)回填本地表单状态。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComponentId(value.componentId)
      setMethod(value.method)
      setSelectedComponent(getComponentById(value.componentId, components))
    }
  }, [value])

  if (!curComponentId) return null

  /**
   * 切换目标组件时,更新选中组件以便刷新其可用方法列表
   * @param value - 新选中的目标组件 id
   */
  function componentChange(value: number) {
    setSelectedComponent(getComponentById(value, components))
  }
  return (
    <div className='flex items-center justify-center mt-[10px]'>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ width: 600 }}
      >
        <Form.Item label='组件'>
          <TreeSelect
            style={{ width: 500, height: 50 }}
            treeData={components}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            value={componentId}
            onChange={(value) => {
              componentChange(value)
              setComponentId(value)
              onChange?.({
                type: 'componentMethod',
                config: {
                  componentId: value,
                  method: method!,
                },
              })
            }}
          />
        </Form.Item>
        <Form.Item label='方法'>
          {/* 方法下拉项来自目标组件在 componentConfig 中声明的 methods */}
          <Select
            style={{ width: 500, height: 50 }}
            options={componentConfig[selectedComponent?.name || '']?.methods?.map((method) => ({
              label: method.label,
              value: method.name,
            }))}
            onChange={(value) => {
              setMethod(value)
              onChange?.({
                type: 'componentMethod',
                config: {
                  componentId: componentId!,
                  method: value,
                },
              })
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
