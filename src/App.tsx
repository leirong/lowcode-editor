import "./App.css"
import { Routes, Route } from "react-router-dom"
import { Layout } from "./components"
import { Editor, Preview } from "./pages"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Editor />} />
        <Route path="preview" element={<Preview />} />
      </Route>
    </Routes>
  )
}

export default App
