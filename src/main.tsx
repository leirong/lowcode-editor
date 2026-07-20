/**
 * @file 应用入口:挂载根组件,并注入全局所需的 Provider。
 */
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById("root")!).render(
  // BrowserRouter:提供路由能力,basename 适配部署子路径
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    {/* DndProvider:拖拽物料到画布依赖 react-dnd,HTML5Backend 为浏览器原生拖拽后端 */}
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </BrowserRouter>
)
