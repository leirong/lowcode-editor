import { Outlet } from "react-router-dom"
import { Header } from "../Header"

export function Layout() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[60px] flex item-center border-b-[1px] border-[#000]">
        <Header />
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
