import { Form, Input, Select } from 'antd'
import { ComponentProps, useComponentsStore } from '../../../../../stores/components'
import { ComponentSetter, useComponentConfigStore } from '../../../../../stores/componentConfig'
import { useEffect } from 'react'

export function ComponentAttr() {
  const [form] = Form.useForm()

  const { curComponentId, curComponent, updateComponentProps } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  useEffect(() => {
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.props })
  }, [curComponent])

  if (!curComponentId || !curComponent) return null

  const { setter = [] } = componentConfig[curComponent.name]

  const renderFormItemChildren = (setting: ComponentSetter) => {
    const { type, options } = setting
    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'input') {
      return <Input />
    }
  }

  function valueChange(changeValues: ComponentProps) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues)
    }
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      onValuesChange={valueChange}
    >
      <Form.Item label='组件id'>
        <Input
          value={curComponent.id}
          disabled
        />
      </Form.Item>
      <Form.Item label='组件名称'>
        <Input
          value={curComponent.name}
          disabled
        />
      </Form.Item>
      <Form.Item label='组件描述'>
        <Input
          value={curComponent.desc}
          disabled
        />
      </Form.Item>
      {setter.map((item) => {
        return (
          <Form.Item
            key={item.name}
            name={item.name}
            label={item.label}
          >
            {renderFormItemChildren(item)}
          </Form.Item>
        )
      })}
    </Form>
  )
}
