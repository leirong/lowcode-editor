import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </BrowserRouter>
)
