import MonacoEditor, { OnMount } from "@monaco-editor/react"
import { editor } from "monaco-editor"

export interface CssEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  options?: editor.IStandaloneEditorConstructionOptions
}

const handleEditorMount: OnMount = (editor, monaco) => {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
    editor.getAction("editor.action.formatDocument")?.run()
  })
}

export default function CssEditor({
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
