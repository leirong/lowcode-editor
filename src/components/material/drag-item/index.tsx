import { useDrag } from "react-dnd"

export interface DragItemProps {
  name: string
}
const DragItem = ({ name }: DragItemProps) => {
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
      {name}
    </div>
  )
}

export default DragItem
