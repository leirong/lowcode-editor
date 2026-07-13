/**
 * @file 编辑页:采用 Allotment 分割出三栏可拖拽调整宽度的布局。
 * 左侧物料面板、中间画布编辑区、右侧属性设置面板。
 */
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { MaterialPanel } from "./components/MaterialPanel"
import { EditArea } from "./components/EditArea"
import { Setting } from "./components/Setting"

/**
 * 编辑页组件,分割出物料面板、画布编辑区与属性设置面板三栏布局
 */
export const Editor = () => {
  return (
    <Allotment>
      {/* 左栏:物料面板(可拖拽的组件库) */}
      <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
        <MaterialPanel />
      </Allotment.Pane>
      {/* 中栏:画布编辑区,展示并操作组件树 */}
      <Allotment.Pane>
        <EditArea />
      </Allotment.Pane>
      {/* 右栏:属性 / 样式 / 事件设置面板 */}
      <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
        <Setting />
      </Allotment.Pane>
    </Allotment>
  )
}
