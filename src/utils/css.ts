/**
 * @file CSS 工具:在"CSS 文本"与"React 内联样式对象"之间互转,
 * 供样式设置面板的代码编辑器(CSS 文本)与组件 styles(对象)双向同步。
 */
import { camelCase, kebabCase } from "lodash-es"
import { CSSProperties } from "react"
import parse from "style-to-object"

/**
 * 将用户书写的 CSS 文本(形如 `.comp { width: 10px; }`)解析为驼峰命名的样式对象
 * @param cssString - CSS 文本字符串
 * @returns 驼峰命名的样式对象;解析结果为空返回 null;发生异常时返回 undefined
 */
export function styleToObject(cssString: string) {
  try {
    const cssStr = cssString
      .replace(/\/\*.*\*\//, "") // 去掉注释 /** */
      .replace(/(\.?[^{]+{)/, "") // 去掉 .comp {
      .replace("}", "") // 去掉 }

    const obj = parse(cssStr)

    if (!obj) return null

    // 转驼峰:CSS 的 kebab-case 属性名转为 React 内联样式所需的 camelCase
    const cssObj: Record<string, string> = {}

    Object.keys(obj).forEach((key) => {
      cssObj[camelCase(key)] = obj[key]
    })
    return cssObj
  } catch (error) {
    console.log("styleToObject error:", error)
  }
}

/**
 * 将样式对象序列化为 `.comp { ... }` 形式的 CSS 文本,便于在编辑器中展示与编辑
 * @param obj - React 内联样式对象
 * @returns 标准 CSS 文本字符串
 */
export function objectToStyle(obj: CSSProperties) {
  let str = `.comp {\n`
  for (const key in obj) {
    const value = obj[key as keyof CSSProperties]
    if (!value) {
      continue
    }
    let cssValue = `${value}`
    // 宽高等纯数值默认补上 px 单位
    if (["width", "height"].includes(key) && !cssValue.endsWith("px")) {
      cssValue += "px"
    }

    // 属性名转回 kebab-case 输出为标准 CSS
    str += `\t${kebabCase(key)}: ${cssValue};\n`
  }
  str += `}`
  return str
}
