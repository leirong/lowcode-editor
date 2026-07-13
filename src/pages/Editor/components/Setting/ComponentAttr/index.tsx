import { Form, Input, Select } from 'antd'
import { ComponentProps, useComponentsStore } from '../../../../../stores/components'
import { ComponentSetter, useComponentConfigStore } from '../../../../../stores/componentConfig'
import { useEffect } from 'react'

/**
 * 属性设置面板:根据当前选中组件的配置(setter)动态渲染属性表单,
 * 表单改动实时写回组件树 store(updateComponentProps)。
 */
export function ComponentAttr() {
  const [form] = Form.useForm()

  const { curComponentId, curComponent, updateComponentProps } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  useEffect(() => {
    // 切换选中组件时,用其已有 props 回填表单
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.props })
  }, [curComponent])

  if (!curComponentId || !curComponent) return null

  // 从组件配置里取出该组件的属性 setter 列表(决定渲染哪些表单项)
  const { setter = [] } = componentConfig[curComponent.name]

  /**
   * 按 setter 的类型渲染对应的表单控件(下拉框 / 输入框)
   * @param setting - 属性 setter 配置
   * @returns 对应类型的表单控件
   */
  const renderFormItemChildren = (setting: ComponentSetter) => {
    const { type, options } = setting
    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'input') {
      return <Input />
    }
  }

  /**
   * 表单值变化时,把变更写回组件 props
   * @param changeValues - 变更的属性值
   */
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
      {/* 组件的固定信息(id / 名称 / 描述),只读展示 */}
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
      {/* 按配置的 setter 动态渲染可编辑的属性表单项 */}
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
