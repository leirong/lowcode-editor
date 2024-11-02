import { Segmented } from "antd"
import { useComponentsStore } from "../../stores/components"
import { useState } from "react"
import ComponentAttr from "./component-attr"
import ComponentStyle from "./component-style"
import ComponentEvent from "./component-event"

export default function Setting() {
  const { curComponentId } = useComponentsStore()

  const [key, setKey] = useState<string>("属性")

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
        {key === "属性" && <ComponentAttr />}
        {key === "样式" && <ComponentStyle />}
        {key === "事件" && <ComponentEvent />}
      </div>
    </div>
  )
}
