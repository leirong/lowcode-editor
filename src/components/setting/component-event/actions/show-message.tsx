import { Input, Select } from "antd"
import { useComponentsStore } from "../../../../stores/components"
interface ShowMessageProps {
  eventName: string
}
const ShowMessage = ({ eventName }: ShowMessageProps) => {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore()
  if (!curComponentId || !curComponent) return null
  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>类型</div>
        <div>
          <Select
            style={{ width: 160 }}
            options={[
              { label: "成功", value: "success" },
              { label: "失败", value: "error" },
            ]}
            onChange={(value) => {
              updateComponentProps(curComponentId, {
                [eventName]: {
                  ...curComponent?.props?.[eventName],
                  config: {
                    ...curComponent?.props?.[eventName]?.config,
                    type: value,
                  },
                },
              })
            }}
            value={curComponent?.props?.[eventName]?.config?.type}
          />
        </div>
      </div>
      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>文本：</div>
        <div>
          <Input
            onChange={(e) => {
              updateComponentProps(curComponentId, {
                [eventName]: {
                  ...curComponent?.props?.[eventName],
                  config: {
                    ...curComponent?.props?.[eventName]?.config,
                    text: e.target.value,
                  },
                },
              })
            }}
            value={curComponent?.props?.[eventName]?.config?.text}
          />
        </div>
      </div>
    </div>
  )
}

export default ShowMessage
