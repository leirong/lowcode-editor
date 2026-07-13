import { Segmented } from "antd"
import { useComponentsStore } from "@/stores"
import { useState } from "react"
import { ComponentAttr } from "./ComponentAttr"
import { ComponentStyle } from "./ComponentStyle"
import { ComponentEvent } from "./ComponentEvent"

/**
 * 右侧设置面板:用 Segmented 切换「属性 / 样式 / 事件」三个 Tab,
 * 分别渲染对应的配置组件,统一读取/写回当前选中组件的配置。
 */
export function Setting() {
  const { curComponentId } = useComponentsStore()

  // 当前激活的 Tab,默认展示「属性」
  const [key, setKey] = useState<string>("属性")

  // 未选中任何组件时不渲染面板
  if (!curComponentId) return null

  return (
    <div className="h-full overflow-y-scroll">
      <Segmented
        block
        value={key}
        onChange={setKey}
        options={["属性", "样式", "事件"]}
      />
      <div className="pt-[20px]">
        {/* 按当前 Tab 渲染对应的配置面板 */}
        {key === "属性" && <ComponentAttr />}
        {key === "样式" && <ComponentStyle />}
        {key === "事件" && <ComponentEvent />}
      </div>
    </div>
  )
}
