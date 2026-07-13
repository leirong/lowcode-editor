/**
 * @file 「自定义 JS」动作的配置表单:用 Monaco 编辑器让用户编写事件触发时执行的 JS 代码。
 * 代码在预览态由 Preview 通过 new Function 执行,并注入 context/args。
 */
import MonacoEditor, { OnMount } from "@monaco-editor/react"
import { useState } from "react"
import { useComponentsStore } from "../../../../../../stores/components"
import { Form } from "antd"
export interface CustomJSConfig {
  type: "customJS"
  /** 用户编写的 JS 源码 */
  code: string
}
export interface CustomJSProps {
  /** 已保存的代码,用于回填 */
  value?: string
  onChange?: (config: CustomJSConfig) => void
}
/**
 * 「自定义 JS」动作的配置表单
 * @param props - 组件属性
 * @param props.value - 已保存的代码,用于回填
 * @param props.onChange - 配置变更回调
 */
export function CustomJS({ value, onChange }: CustomJSProps) {
  const { curComponentId } = useComponentsStore()

  const [code, setCode] = useState(value)

  if (!curComponentId) return null

  /**
   * 编辑器挂载后注册 Cmd/Ctrl+J 快捷键触发代码格式化
   * @param editor - Monaco 编辑器实例
   * @param monaco - Monaco 命名空间对象
   */
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run()
    })
  }

  /**
   * 代码变更时同步本地状态并回传配置
   * @param jsCode - 编辑器当前的 JS 源码
   */
  const codeChange = (jsCode?: string) => {
    setCode(jsCode)
    onChange?.({
      type: "customJS",
      code: jsCode || "",
    })
  }

  return (
    <div className="flex justify-center items-center mt-[10px]">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ width: 700 }}
      >
        <Form.Item label="自定义 JS">
          <MonacoEditor
            width={"600px"}
            height={"400px"}
            path="action.js"
            language="javascript"
            onMount={handleEditorMount}
            onChange={codeChange}
            value={code}
            options={{
              fontSize: 14,
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
              scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
              },
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
