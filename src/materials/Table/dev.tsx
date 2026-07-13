/**
 * @file Table 物料的编辑态(dev)组件:画布内展示的表格。
 * 仅接受 TableColumn 子物料拖入,并从子节点 props 中提取列定义;数据源为空(编辑态不请求接口)。
 */
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

/** 从 TableColumn 子节点上读取的列配置字段 */
interface TableColumnProps {
  id: number
  title: string
  dataIndex: string
}

/**
 * Table 物料的编辑态(dev)组件,仅接受 TableColumn 拖入并从子节点提取列定义
 * @param props - 组件属性
 * @param props.id - 组件 id
 * @param props.name - 组件名称
 * @param props.children - 子节点(TableColumn)
 * @param props.styles - 组件样式
 */
export function Table({
  id,
  name,
  children,
  styles,
}: CommonComponentProps & PropsWithChildren) {
  // 允许 TableColumn 拖入本表格作为列
  const { canDrop, drop } = useItemDrop(["TableColumn"], id)

  const divRef = useRef<HTMLDivElement>(null)
  // 让表格自身可被拖动(移动到其他容器)
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  })

  useEffect(() => {
    // 同一 DOM 同时作为拖入目标(drop)和可拖动源(drag)
    drop(divRef)
    drag(divRef)
  }, [])

  // 将 TableColumn 子节点转换为 antd Table 的 columns;标题上带 data-component-id 以便在画布中定位选中该列
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
