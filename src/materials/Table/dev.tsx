import { Table as AntdTable } from "antd"
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { useDrag } from "react-dnd"
import { useItemDrop } from "../useItemDrop"

interface TableColumnProps {
  id: number
  title: string
  dataIndex: string
}

export function Table({
  id,
  name,
  children,
  styles,
}: CommonComponentProps & PropsWithChildren) {
  const { canDrop, drop } = useItemDrop(["TableColumn"], id)

  const divRef = useRef<HTMLDivElement>(null)
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  })

  useEffect(() => {
    drop(divRef)
    drag(divRef)
  }, [])

  const columns = useMemo(() => {
    return (
      React.Children.map(children, (item) => {
        const props = (item as ReactElement<TableColumnProps>).props
        return {
          title: (
            <div className="m-[-16px] p-[16px]" data-component-id={props?.id}>
              {props?.title}
            </div>
          ),
          dataIndex: props?.dataIndex,
          key: props?.id,
        }
      }) || []
    )
  }, [children])

  return (
    <div
      className={`w-100% ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      ref={divRef}
      style={styles}
      data-component-id={id}
    >
      <AntdTable columns={columns} dataSource={[]} pagination={false} />
    </div>
  )
}
