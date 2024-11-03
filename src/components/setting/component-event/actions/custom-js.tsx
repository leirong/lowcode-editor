import MonacoEditor, { OnMount } from "@monaco-editor/react"
import { useState } from "react"
import { useComponentsStore } from "../../../../stores/components"
import { Form } from "antd"
export interface CustomJSConfig {
  type: "customJS"
  code: string
}
export interface CustomJSProps {
  value?: string
  onChange?: (config: CustomJSConfig) => void
}
export default function CustomJS({ value, onChange }: CustomJSProps) {
  const { curComponentId } = useComponentsStore()

  if (!curComponentId) return

  const [code, setCode] = useState(value)

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run()
    })
  }

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
