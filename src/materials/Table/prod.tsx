/**
 * @file Table 物料的生产态(prod)组件:预览/运行时的真实表格。
 * 会根据配置的 url 请求远程数据填充表格,并按列的 type 做渲染(如日期格式化)。
 */
import { Table as AntdTable } from "antd"
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react"
import axios from "axios"
import dayjs from "dayjs"

interface TableProps extends CommonComponentProps, PropsWithChildren {
  /** 数据接口地址 */
  url: string
}

/** 从 TableColumn 子节点上读取的列配置字段 */
interface TableColumnProps {
  title: string
  dataIndex: string
  /** 列类型,date 时对值做日期格式化 */
  type?: string
}

/**
 * Table 物料的生产态(prod)组件,请求远程数据并渲染真实表格
 * @param props - 组件属性
 * @param props.id - 组件 id
 * @param props.children - 子节点(TableColumn)
 * @param props.url - 数据接口地址
 * @param props.styles - 组件样式
 */
export function Table({ id, children, url, styles }: TableProps) {
  const [dataSource, setDataSource] = useState<Array<Record<string, unknown>>>(
    []
  )

  const [loading, setLoading] = useState(false)

  // 请求接口数据填充表格
  const getData = async () => {
    if (url) {
      setLoading(true)

      const { data } = await axios.get(url)
      setDataSource(data)

      setLoading(false)
    }
  }
  useEffect(() => {
    // 根据 url 拉取远程数据,setState 发生在异步回调中,属于与外部系统同步。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getData()
  }, [url])

  // 将 TableColumn 子节点转换为 antd columns;date 类型列用 dayjs 格式化展示
  const columns = useMemo(() => {
    return (
      React.Children.map(children, (item) => {
        const props = (item as ReactElement<TableColumnProps>).props
        if (props?.type === "date") {
          return {
            title: props?.title,
            dataIndex: props?.dataIndex,
            render: (value: string) =>
              value ? dayjs(value).format("YYYY-MM-DD") : null,
          }
        } else {
          return {
            title: props?.title,
            dataIndex: props?.dataIndex,
          }
        }
      }) || []
    )
  }, [children])

  return (
    <div className={`w-100%`} style={styles} data-component-id={id}>
      <AntdTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="id"
        loading={loading}
      />
    </div>
  )
}
