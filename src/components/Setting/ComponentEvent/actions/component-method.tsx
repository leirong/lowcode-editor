import { Form, Select, TreeSelect } from 'antd'
import { Component, getComponentById, useComponentsStore } from '../../../../stores/components'
import { useEffect, useState } from 'react'
import { useComponentConfigStore } from '../../../../stores/componentConfig'

export interface ComponentMethodConfig {
  type: 'componentMethod'
  config: {
    componentId: number
    method: string
  }
}

interface ComponentMethodProps {
  value?: ComponentMethodConfig['config']
  onChange?: (value: ComponentMethodConfig) => void
}

export const ComponentMethod = ({ value, onChange }: ComponentMethodProps) => {
  const { curComponentId, components } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

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
