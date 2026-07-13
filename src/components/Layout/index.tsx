/**
 * @file 全局布局外壳:顶部固定 Header(高 60px),下方为路由内容区(Editor / Preview)。
 */
import { Outlet } from "react-router-dom"
import { Header } from "../Header"

/**
 * 全局布局外壳组件,渲染顶部标题栏与路由内容区
 */
export function Layout() {
  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="h-[60px] flex item-center border-b-[1px] border-[#000]">
        <Header />
      </div>
      {/* 主体内容区:由路由决定渲染编辑页或预览页 */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
