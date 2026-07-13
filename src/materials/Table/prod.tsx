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
  url: string
}

interface TableColumnProps {
  title: string
  dataIndex: string
  type?: string
}

export function Table({ id, children, url, styles }: TableProps) {
  const [dataSource, setDataSource] = useState<Array<Record<string, unknown>>>(
    []
  )

  const [loading, setLoading] = useState(false)

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
