import { Collapse, Select } from "antd"
import { useComponentConfigStore } from "../../../stores/component-config"
import { useComponentsStore } from "../../../stores/components"
import GoToLink from "./actions/go-to-link"
import ShowMessage from "./actions/show-message"

export default function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore()
  const { componentConfig } = useComponentConfigStore()
  if (!curComponentId || !curComponent) return null

  const { events = [] } = componentConfig[curComponent.name]

  if (!events.length) return null

  const items = events.map(({ name, label }) => {
    return {
      key: name,
      label: label,
      children: (
        <div>
          <div className="flex items-center">
            <div>动作：</div>
            <Select
              className="w-[160px]"
              options={[
                { label: "显示提示", value: "showMessage" },
                { label: "跳转链接", value: "goToLink" },
              ]}
              value={curComponent?.props?.[name]?.type}
              onChange={(value) => {
                updateComponentProps(curComponentId, {
                  [name]: {
                    type: value,
                  },
                })
              }}
            />
          </div>
          {curComponent?.props?.[name]?.type === "goToLink" && (
            <GoToLink eventName={name} />
          )}
          {curComponent?.props?.[name]?.type === "showMessage" && (
            <ShowMessage eventName={name} />
          )}
        </div>
      ),
    }
  })

  return (
    <div className="px-[10px]">
      <Collapse className="mb-[10px]" items={items} />
    </div>
  )
}
