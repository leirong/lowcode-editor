import { Segmented } from "antd"
import { useState } from "react"
import { MaterialList } from "./MaterialList"
import { Outline } from "./Outline"
import { Source } from "./Source"

export function MaterialPanel() {
  // 当前激活的 Tab,默认展示"物料"面板
  const [key, setKey] = useState<string>("物料")

  return (
    <div>
      {/* 分段控制器:在"物料列表 / 大纲树 / 源码"三个视图间切换 */}
      <Segmented
        value={key}
        onChange={setKey}
        block
        options={["物料", "大纲", "源码"]}
      />
      <div className="pt-[20px] h-[calc(100vh-60px-30px-20px)]">
        {/* 根据激活 Tab 渲染对应内容 */}
        {key === "物料" && <MaterialList />}
        {key === "大纲" && <Outline />}
        {key === "源码" && <Source />}
      </div>
    </div>
  )
}
