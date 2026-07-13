import { camelCase, kebabCase } from "lodash-es"
import { CSSProperties } from "react"
import parse from "style-to-object"

export function styleToObject(cssString: string) {
  try {
    const cssStr = cssString
      .replace(/\/\*.*\*\//, "") // 去掉注释 /** */
      .replace(/(\.?[^{]+{)/, "") // 去掉 .comp {
      .replace("}", "") // 去掉 }

    const obj = parse(cssStr)

    if (!obj) return null

    // 转驼峰
    const cssObj: Record<string, string> = {}

    Object.keys(obj).forEach((key) => {
      cssObj[camelCase(key)] = obj[key]
    })
    return cssObj
  } catch (error) {
    console.log("styleToObject error:", error)
  }
}

export function objectToStyle(obj: CSSProperties) {
  let str = `.comp {\n`
  for (const key in obj) {
    const value = obj[key as keyof CSSProperties]
    if (!value) {
      continue
    }
    let cssValue = `${value}`
    if (["width", "height"].includes(key) && !cssValue.endsWith("px")) {
      cssValue += "px"
    }

    str += `\t${kebabCase(key)}: ${cssValue};\n`
  }
  str += `}`
  return str
}
