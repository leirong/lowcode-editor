import { Button, Space } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import { useComponentsStore } from "../../stores/components"

export function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
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
