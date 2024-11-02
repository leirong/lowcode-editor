import { Form, InputNumber, Select } from "antd"
import { useComponentsStore } from "../../../stores/components"
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from "../../../stores/component-config"
import { useEffect, useState } from "react"
import CssEditor from "../css-editor"
import { debounce } from "lodash-es"
import { styleToObject, objectToStyle } from "../../../utils/css"

export default function ComponentStyle() {
  const [form] = Form.useForm()

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  const [css, setCss] = useState<string>(`.comp {\n\n}`)

  useEffect(() => {
    form.resetFields()
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.styles })
    setCss(objectToStyle(curComponent?.styles || {}))
  }, [curComponent])

  if (!curComponentId || !curComponent) return null

  const { stylesSetter = [] } = componentConfig[curComponent.name]

  const renderFormItemChildren = (setting: ComponentSetter) => {
    const { type, options } = setting
    if (type === "select") {
      return <Select options={options} />
    } else if (type === "inputNumber") {
      return <InputNumber />
    }
  }

  function valueChange(changeValues: ComponentConfig) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues)
    }
  }

  const handleCssChange = debounce((css: string | undefined) => {
    if (curComponentId && css) {
      setCss(css)
      const styles = styleToObject(css)
      updateComponentStyles(
        curComponentId,
        { ...form.getFieldsValue(), ...styles },
        true
      )
    }
  }, 500)

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      onValuesChange={valueChange}
    >
      {stylesSetter.map((item) => {
        return (
          <Form.Item key={item.name} name={item.name} label={item.label}>
            {renderFormItemChildren(item)}
          </Form.Item>
        )
      })}
      <div className="h-[200px] border-[1px] border-[#ccc]">
        <CssEditor value={css} onChange={handleCssChange} />
      </div>
    </Form>
  )
}
