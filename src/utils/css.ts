import { camelCase, kebabCase } from "lodash-es"
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
    const cssObj: Record<string, any> = {}

    Object.keys(obj).forEach((key) => {
      cssObj[camelCase(key)] = obj[key]
    })
    return cssObj
  } catch (error) {
    console.log("styleToObject error:", error)
  }
}

export function objectToStyle(obj: any) {
  let str = `.comp {\n`
  for (let key in obj) {
    let value = obj[key]
    if (!value) {
      continue
    }
    if (["width", "height"].includes(key) && !value.toString().endsWith("px")) {
      value += "px"
    }

    str += `\t${kebabCase(key)}: ${value};\n`
  }
  str += `}`
  return str
}
