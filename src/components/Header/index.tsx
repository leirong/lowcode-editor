/**
 * @file 顶部标题栏:展示标题,并根据当前路由在"预览 / 退出预览"按钮间切换。
 */
import { Button, Space } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { useComponentsStore } from "@/stores"

/**
 * 顶部标题栏组件,根据当前路由切换预览与退出预览按钮
 */
export function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // 当前是否处于预览页
  const isPreview = pathname === "/preview"
  const { setCurComponentId } = useComponentsStore()
  return (
    <div className="w-[100%] h-[100%]">
      <div className="h-[50px] flex justify-between items-center px-[20px]">
        <div className="text-[30px] font-bold">低代码编辑器</div>
        <Space>
          {!isPreview && (
            <Button
              type="primary"
              onClick={() => {
                // 进入预览前清空选中组件,避免预览页残留选中态
                setCurComponentId(null)
                navigate("/preview")
              }}
            >
              预览
            </Button>
          )}
          {isPreview && (
            <Button type="primary" onClick={() => navigate("/")}>
              退出预览
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}
