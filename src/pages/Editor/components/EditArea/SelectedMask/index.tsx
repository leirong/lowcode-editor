import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { getComponentById, useComponentsStore } from "@/stores"
import { Dropdown, Popconfirm, Space } from "antd"
import { DeleteOutlined } from "@ant-design/icons"

interface SelectedMaskProps {
  portalWrapperClassName: string
  containerClassName: string
  componentId: number
}

export function SelectedMask({
  containerClassName,
  portalWrapperClassName,
  componentId,
}: SelectedMaskProps) {
  // 遮罩位置尺寸,以及操作栏标签(面包屑 + 删除按钮)的位置
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  })

  const { components, curComponentId, setCurComponentId, deleteComponent } =
    useComponentsStore()

  /**
   * 计算遮罩位置:测量选中组件 DOM 相对画布容器的偏移,换算成容器内绝对定位坐标
   */
  function updatePosition() {
    if (!componentId) return

    const container = document.querySelector(`.${containerClassName}`)
    if (!container) return

    // 通过 data-component-id 定位选中组件对应的真实 DOM
    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!node) return

    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect()

    let labelTop = top - containerTop + container.scrollTop
    // 操作栏标签放在选中框右上角
    const labelLeft = left - containerLeft + width

    // 标签顶到容器上边缘外时下移,避免被遮挡
    if (labelTop <= 0) {
      labelTop -= -20
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    })
  }

  // 选中组件切换或组件树变化时更新位置;延迟 200ms 等待 DOM 布局稳定后再测量
  useEffect(() => {
    setTimeout(() => {
      updatePosition()
    }, 200)
  }, [componentId, components])

  // 监听画布容器尺寸变化,同步刷新遮罩位置
  useEffect(() => {
    const container = document.querySelector(`.${containerClassName}`)!
    const ob = new ResizeObserver(() => {
      updatePosition()
    })
    ob.observe(container)
    return () => {
      ob.disconnect()
    }
  }, [])

  // Portal 挂载目标节点(画布内的容器)。
  // portal-wrapper 在 JSX 中排在本组件之后,首次渲染(如刷新页面且已有选中态)时它尚未进入 DOM,
  // 故延后到挂载后再获取,避免 createPortal 收到 null 抛「Target container is not a DOM element」
  const [el, setEl] = useState<Element | null>(null)
  useEffect(() => {
    setEl(document.querySelector(`.${portalWrapperClassName}`))
  }, [portalWrapperClassName])

  // 当前选中的组件,用于展示 desc 及计算父级链
  const curComponent = useMemo(() => {
    return getComponentById(componentId, components)
  }, [componentId])

  /**
   * 删除当前组件并清空选中态
   */
  function handleDelete() {
    deleteComponent(curComponentId!)
    setCurComponentId(null)
  }

  // 沿 parentId 向上回溯,收集所有祖先组件,供面包屑下拉快速选中父级
  const parentComponents = useMemo(() => {
    const parentComponents = []
    let component = curComponent

    while (component?.parentId) {
      component = getComponentById(component.parentId, components)!
      parentComponents.push(component)
    }

    return parentComponents
  }, [curComponent])

  // 通过 Portal 把选中遮罩渲染到画布容器内;挂载节点未就绪时不渲染
  if (!el) return null

  return createPortal(
    <>
      {/* 选中框:半透明蓝底 + 蓝色虚线边框,区别于悬浮遮罩的实线 */}
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      {/* 操作栏标签:宽度过小时隐藏,以右下角为锚点贴在选中框右上角外侧 */}
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <Space>
          {/* 面包屑下拉:列出所有祖先组件,点击可快速选中父级;无父级时禁用 */}
          <Dropdown
            menu={{
              items: parentComponents.map((item) => ({
                key: item.id,
                label: item.name,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key)
              },
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: "0 8px",
                backgroundColor: "blue",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {curComponent?.desc}
            </div>
          </Dropdown>

          {/* 删除按钮:根组件(id 为 1,通常是 Page)不允许删除,故隐藏 */}
          {curComponentId !== 1 && (
            <div style={{ padding: "0 8px", backgroundColor: "blue" }}>
              <Popconfirm
                title="确认删除？"
                okText={"确认"}
                cancelText={"取消"}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: "#fff" }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el
  )
}
