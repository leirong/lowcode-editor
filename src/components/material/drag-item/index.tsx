import { useDrag } from "react-dnd"

export interface DragItemProps {
  name: string
  desc: string
}
const DragItem = ({ name, desc }: DragItemProps) => {
  const [_, drag] = useDrag(() => ({
    type: name,
    item: {
      type: name,
    },
  }))
  return (
    <div
      ref={drag}
      className="border-dashed border-[1px] border-[#000] py-[8px] px-[10px] m-[10px] cursor-move inline-block bg-white hover:bg-[#ccc]"
    >
      {desc}
    </div>
  )
}

export default DragItem
