import { nanoid } from 'nanoid'

/** 生成适合作为组件、字段等内部标识的 Nano ID。 */
export function randomId(length = 10): string {
  return nanoid(length)
}
