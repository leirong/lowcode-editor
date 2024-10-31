import { useEffect } from "react"
import { useComponentsStore } from "../../stores/components"

export default function EditArea() {
  const { components, addComponent, deleteComponent } = useComponentsStore()

  useEffect(() => {
    addComponent(
      {
        id: 222,
        name: "Container",
        props: {},
        children: [],
      },
      1
    )
    addComponent(
      {
        id: 333,
        name: "Video",
        props: {},
        children: [],
      },
      222
    )
    deleteComponent(333)
  }, [])

  return (
    <div>
      <pre>{JSON.stringify(components, null, 2)}</pre>
    </div>
  )
}
