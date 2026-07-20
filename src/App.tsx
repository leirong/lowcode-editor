/**
 * @file 应用根组件:定义顶层路由。
 * Layout 作为外壳(带 Header),内部通过 Outlet 切换编辑页(Editor)与预览页(Preview)。
 */
import "./App.css"
import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { Editor, Preview } from "./pages"

/**
 * 应用根组件,定义顶层路由结构
 */
function App() {
  return (
    <Routes>
      {/* 所有页面共用 Layout 外壳 */}
      <Route path="/" element={<Layout />}>
        {/* 默认(index)进入编辑页 */}
        <Route index element={<Editor />} />
        {/* /preview 进入预览页 */}
        <Route path="preview" element={<Preview />} />
      </Route>
    </Routes>
  )
}

export default App
