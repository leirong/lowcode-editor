import { Table as AntdTable } from "antd"
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react"
import axios from "axios"
import dayjs from "dayjs"

interface TableProps extends CommonComponentProps, PropsWithChildren {
  url: string
}

export default function Table({ id, children, url, styles }: TableProps) {
  const [dataSource, setDataSource] = useState<Array<Record<string, any>>>([])

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
    getData()
  }, [url])

  const columns = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      if (item?.props?.type === "date") {
        return {
          title: item.props?.title,
          dataIndex: item.props?.dataIndex,
          render: (value: any) =>
            value ? dayjs(value).format("YYYY-MM-DD") : null,
        }
      } else {
        return {
          title: item.props?.title,
          dataIndex: item.props?.dataIndex,
        }
      }
    })
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
