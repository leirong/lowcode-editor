import { Allotment } from "allotment"
import "allotment/dist/style.css"
import Header from "../header"
import Material from "../material"
import EditArea from "../edit-area"
import Setting from "../setting"
const Editor = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[60px] flex item-center border-b-[1px] border-[#000]">
        <Header />
      </div>
      <Allotment>
        <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
          <Material />
        </Allotment.Pane>
        <Allotment.Pane>
          <EditArea />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
          <Setting />
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}

export default Editor
