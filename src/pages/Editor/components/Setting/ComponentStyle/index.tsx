import { Form, InputNumber, Select } from 'antd'
import { useComponentsStore } from '@/stores/components'
import { ComponentSetter, useComponentConfigStore } from '@/stores/componentConfig'
import { CSSProperties, useEffect, useState } from 'react'
import { CssEditor } from '../CssEditor'
import { debounce } from 'lodash-es'
import { styleToObject, objectToStyle } from '@/utils/css'

/**
 * 样式设置面板:根据配置的 stylesSetter 渲染表单式样式项,
 * 同时内嵌 CSS 编辑器供手写样式;两者最终都写回组件的 styles(updateComponentStyles)。
 */
export function ComponentStyle() {
  const [form] = Form.useForm()

  const { curComponentId, curComponent, updateComponentStyles } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  // CSS 编辑器内容,包裹在 .comp 选择器里
  const [css, setCss] = useState<string>(`.comp {\n\n}`)

  useEffect(() => {
    form.resetFields()
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.styles })
    // 切换选中组件时,用其已有 styles 回填表单与 CSS 编辑器。
    // objectToStyle 把样式对象序列化成 CSS 字符串。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCss(objectToStyle(curComponent?.styles || {}))
  }, [curComponent])

  if (!curComponentId || !curComponent) return null

  // 该组件配置的样式表单项列表
  const { stylesSetter = [] } = componentConfig[curComponent.name]

  /**
   * 按类型渲染样式表单控件(下拉框 / 数字输入框)
   * @param setting - 样式 setter 配置
   * @returns 对应类型的表单控件
   */
  const renderFormItemChildren = (setting: ComponentSetter) => {
    const { type, options } = setting
    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'inputNumber') {
      return <InputNumber />
    }
  }

  /**
   * 表单式样式项变化时,写回组件 styles
   * @param changeValues - 变更的样式值
   */
  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues)
    }
  }

  /**
   * CSS 编辑器内容变化(防抖 500ms):把 CSS 字符串解析成对象,
   * 与表单项样式合并后写回;第三个参数 true 表示替换整个 styles。
   * @param css - CSS 编辑器内容
   */
  const handleCssChange = debounce((css: string | undefined) => {
    if (curComponentId && css) {
      setCss(css)
      const styles = styleToObject(css)
      updateComponentStyles(curComponentId, { ...form.getFieldsValue(), ...styles }, true)
    }
  }, 500)

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      onValuesChange={valueChange}
    >
      {/* 按配置的 stylesSetter 动态渲染样式表单项 */}
      {stylesSetter.map((item) => {
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
      {/* 内嵌 CSS 编辑器,支持手写样式 */}
      <div className='h-[200px] border-[1px] border-[#ccc]'>
        <CssEditor
          value={css}
          onChange={handleCssChange}
        />
      </div>
    </Form>
  )
}
