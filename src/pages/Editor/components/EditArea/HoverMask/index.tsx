import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { getComponentById, useComponentsStore } from "../../../../../stores/components"

interface HoverMaskProps {
  containerClassName: string
  portalWrapperClassName: string
  componentId: number
}

export const HoverMask = ({
  containerClassName,
  portalWrapperClassName,
  componentId,
}: HoverMaskProps) => {
  const { components } = useComponentsStore()
  // 遮罩位置与尺寸,以及右上角标签(组件名)的位置
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  })

  // 根据 id 从组件树中查出当前悬浮的组件,用于展示其 desc
  const curComponent = useMemo(() => {
    return getComponentById(componentId, components)
  }, [componentId])

  // Portal 挂载目标节点(画布内的容器)
  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!
  }, [])

  /**
   * 计算遮罩位置:测量目标组件 DOM 相对画布容器的偏移,换算成遮罩的绝对定位坐标
   */
  function updatePosition() {
    if (!componentId) return
    const container = document.querySelector(`.${containerClassName}`)
    if (!container) return
    // 通过 data-component-id 找到画布中对应的真实 DOM 节点
    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!node) return
    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect()

    // 标签放在目标右上角(left + width 处)
    const labelLeft = left - containerLeft + width
    let labelTop = top - containerTop + container.scrollTop

    // 标签顶到容器上边缘外时下移,避免被遮挡
    if (labelTop <= 0) {
      labelTop += 20
    }

    // 目标视口坐标减去容器坐标,再叠加容器滚动量,得到容器内绝对定位坐标
    setPosition({
      left: left - containerLeft + container.scrollLeft,
      top: top - containerTop + container.scrollTop,
      width,
      height,
      labelLeft,
      labelTop,
    })
  }

  // 悬浮组件切换或组件树变化时,重新测量并更新遮罩位置
  useEffect(() => {
    // 依据当前组件位置测量 DOM 并更新遮罩位置,属于与外部(DOM)同步。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updatePosition()
  }, [componentId, components])

  // 监听画布容器尺寸变化(如窗口缩放、内容增减),同步刷新遮罩位置
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

  // 通过 Portal 把遮罩渲染到画布容器内,使其覆盖在目标组件之上
  return createPortal(
    <>
      {/* 高亮框:半透明蓝底 + 蓝色实线边框,pointerEvents:none 避免拦截鼠标事件 */}
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px solid blue",
          pointerEvents: "none",
          zIndex: 12,
          borderRadius: "5px",
          boxSizing: "border-box",
        }}
      />
      {/* 组件名标签:宽度过小时隐藏;transform 让标签以右下角为锚点贴在高亮框右上角外侧 */}
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
      </div>
    </>,
    el
  )
}
