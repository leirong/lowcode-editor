/**
 * @file 物料列表中的单个可拖拽项:通过 useDrag 声明为拖拽源,拖入画布时用 type(物料名)新增组件。
 */
import { useDrag } from "react-dnd"

export interface DragItemProps {
  /** 物料名(拖拽 type,对应 componentConfig 的 key) */
  name: string
  /** 中文描述,显示在拖拽项上 */
  desc: string
}
export const DragItem = ({ name, desc }: DragItemProps) => {
  // 拖拽源:item.type 即物料名,落到画布 useItemDrop 后据此创建组件
  const [_, drag] = useDrag(() => ({
    type: name,
    item: {
      type: name,
    },
  }))
  return (
    <div
      ref={(node) => {
        drag(node)
      }}
      className="border-dashed border-[1px] border-[#000] py-[8px] px-[10px] m-[10px] cursor-move inline-block bg-white hover:bg-[#ccc]"
    >
      {desc}
    </div>
  )
}
