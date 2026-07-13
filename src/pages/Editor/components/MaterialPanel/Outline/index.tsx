/**
 * @file 大纲面板:用树形结构展示整棵组件树,点击节点即选中对应组件(同步 curComponentId)。
 */
import { Tree } from 'antd'
import { useComponentsStore } from '@/stores'

export function Outline() {
  const { components, setCurComponentId } = useComponentsStore()
  // components 使用自定义 fieldNames(desc/id),与 antd TreeDataNode 结构不一致,此处转为 antd 可接受的类型。
  const treeData = components as any
  return (
    <Tree
      fieldNames={{ title: 'desc', key: 'id' }}
      treeData={treeData}
      showLine
      defaultExpandAll
      onSelect={([selectedKey]) => {
        // 选中大纲节点 → 设为当前编辑组件
        setCurComponentId(selectedKey as number)
      }}
    />
  )
}
