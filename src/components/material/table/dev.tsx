import { Table as AntdTable } from "antd"
import React, { PropsWithChildren, useEffect, useMemo, useRef } from "react"
import { useDrag } from "react-dnd"
import { useItemDrop } from "../../../hooks/useItemDrop"

export default function Table({
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
    return React.Children.map(children, (item: any) => {
      return {
        title: (
          <div
            className="m-[-16px] p-[16px]"
            data-component-id={item.props?.id}
          >
            {item.props?.title}
          </div>
        ),
        dataIndex: item.props?.dataIndex,
        key: item,
      }
    })
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
