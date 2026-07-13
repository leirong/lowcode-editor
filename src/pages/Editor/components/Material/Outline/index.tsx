import { Tree } from 'antd'
import { useComponentsStore } from '../../../../../stores/components'

export function Outline() {
  const { components, setCurComponentId } = useComponentsStore()
  // components 使用自定义 fieldNames(desc/id),与 antd TreeDataNode 结构不一致,此处转为 antd 可接受的类型。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const treeData = components as any
  return (
    <Tree
      fieldNames={{ title: 'desc', key: 'id' }}
      treeData={treeData}
      showLine
      defaultExpandAll
      onSelect={([selectedKey]) => {
        setCurComponentId(selectedKey as number)
      }}
    />
  )
}
