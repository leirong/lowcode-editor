import MonacoEditor, { OnMount } from "@monaco-editor/react"
import { useComponentsStore } from "@/stores"

/**
 * 源码视图:以只读 JSON 形式展示当前组件树,便于查看/调试整体结构
 */
export function Source() {
  const { components } = useComponentsStore()

  /**
   * 编辑器挂载后注册快捷键 Cmd/Ctrl+J,一键格式化 JSON 文档
   * @param editor - Monaco 编辑器实例
   * @param monaco - Monaco 全局对象
   */
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run()
    })
  }

  return (
    <MonacoEditor
      height={"100%"}
      path="components.json"
      language="json"
      onMount={handleEditorMount}
      // 将组件树序列化为带缩进的 JSON 展示
      value={JSON.stringify(components, null, 2)}
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
  )
}
