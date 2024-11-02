import { Allotment } from "allotment"
import "allotment/dist/style.css"
import Header from "../header"
import MaterialWrapper from "../material"
import EditArea from "../edit-area"
import Setting from "../setting"
import { useComponentsStore } from "../../stores/components"
import Preview from "../preview"
const Editor = () => {
  const { mode } = useComponentsStore()
  return (
    <div className="h-full flex flex-col">
      <div className="h-[60px] flex item-center border-b-[1px] border-[#000]">
        <Header />
      </div>
      {mode === "edit" ? (
        <Allotment>
          <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
            <MaterialWrapper />
          </Allotment.Pane>
          <Allotment.Pane>
            <EditArea />
          </Allotment.Pane>
          <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
            <Setting />
          </Allotment.Pane>
        </Allotment>
      ) : (
        <Preview />
      )}
    </div>
  )
}

export default Editor
