import MonacoEditor, { OnMount } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export interface CssEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  options?: editor.IStandaloneEditorConstructionOptions
}

/**
 * 编辑器挂载后注册快捷键:Cmd/Ctrl + J 触发格式化文档
 */
const handleEditorMount: OnMount = (editor, monaco) => {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
    editor.getAction("editor.action.formatDocument")?.run()
  })
}

/**
 * 基于 @monaco-editor 的 CSS 代码编辑器封装,供样式面板使用
 * @param props - 编辑器属性(value / onChange / options)
 */
export function CssEditor({
  value,
  onChange,
  options,
}: CssEditorProps) {
  return (
    <MonacoEditor
      height={"100%"}
      path="component.css"
      language="css"
      value={value}
      onChange={onChange}
      onMount={handleEditorMount}
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
        ...options,
      }}
    />
  )
}
