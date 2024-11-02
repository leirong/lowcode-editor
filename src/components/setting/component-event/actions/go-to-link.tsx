import { Input } from "antd"
import { useComponentsStore } from "../../../../stores/components"
interface GoToLinkProps {
  eventName: string
}
const GoToLink = ({ eventName }: GoToLinkProps) => {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore()
  if (!curComponentId || !curComponent) return null
  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>链接</div>
        <div>
          <Input
            value={curComponent?.props?.[eventName]?.url}
            onChange={(e) => {
              updateComponentProps(curComponentId, {
                [eventName]: {
                  ...curComponent?.props?.[eventName],
                  url: e.target.value,
                },
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default GoToLink
