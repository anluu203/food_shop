"use client"

import { useState } from "react"
import { Card, Table, Tag, DatePicker, Select, Button, Typography, Space } from "antd"
import { ExportOutlined, ImportOutlined, FilterOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface InventoryTransaction {
  id: string
  itemName: string
  type: "import" | "export"
  quantity: number
  unit: string
  unitPrice: number
  totalValue: number
  supplier?: string
  reason: string
  date: string
  staff: string
}

const mockTransactions: InventoryTransaction[] = [
  {
    id: "1",
    itemName: "Thịt bò",
    type: "import",
    quantity: 20,
    unit: "kg",
    unitPrice: 350000,
    totalValue: 7000000,
    supplier: "Công ty Thịt Sạch ABC",
    reason: "Nhập hàng định kỳ",
    date: "2024-01-15",
    staff: "Nguyễn Văn A",
  },
  {
    id: "2",
    itemName: "Thịt bò",
    type: "export",
    quantity: 15,
    unit: "kg",
    unitPrice: 350000,
    totalValue: 5250000,
    reason: "Sử dụng cho món ăn",
    date: "2024-01-15",
    staff: "Trần Thị B",
  },
  {
    id: "3",
    itemName: "Rau xanh",
    type: "import",
    quantity: 10,
    unit: "kg",
    unitPrice: 20000,
    totalValue: 200000,
    supplier: "Nông trại Xanh",
    reason: "Bổ sung tồn kho",
    date: "2024-01-14",
    staff: "Lê Văn C",
  },
  {
    id: "4",
    itemName: "Rau xanh",
    type: "export",
    quantity: 2,
    unit: "kg",
    unitPrice: 20000,
    totalValue: 40000,
    reason: "Hỏng, không sử dụng được",
    date: "2024-01-14",
    staff: "Phạm Thị D",
  },
]

export default function InventoryHistory() {
  const [transactions] = useState<InventoryTransaction[]>(mockTransactions)
  const [filteredTransactions, setFilteredTransactions] = useState<InventoryTransaction[]>(mockTransactions)

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a: InventoryTransaction, b: InventoryTransaction) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag
          color={type === "import" ? "green" : "red"}
          icon={type === "import" ? <ImportOutlined /> : <ExportOutlined />}
        >
          {type === "import" ? "Nhập" : "Xuất"}
        </Tag>
      ),
    },
    {
      title: "Nguyên liệu",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (record: InventoryTransaction) => (
        <Text>
          {record.quantity} {record.unit}
        </Text>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price: number) => <Text className="text-green-600">{price.toLocaleString()}đ</Text>,
    },
    {
      title: "Tổng giá trị",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value: number) => (
        <Text strong className="text-green-600">
          {value.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier: string) => supplier || <Text type="secondary">-</Text>,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
    },
  ]

  const handleFilter = (type?: string, dateRange?: [dayjs.Dayjs, dayjs.Dayjs]) => {
    let filtered = transactions

    if (type && type !== "all") {
      filtered = filtered.filter((t) => t.type === type)
    }

    if (dateRange) {
      filtered = filtered.filter((t) => {
        const transactionDate = dayjs(t.date)
        return (
          transactionDate.isAfter(dateRange[0].startOf("day")) && transactionDate.isBefore(dateRange[1].endOf("day"))
        )
      })
    }

    setFilteredTransactions(filtered)
  }

  return (
    <Card
      title="Lịch sử nhập xuất kho"
      extra={
        <Space>
          <RangePicker onChange={(dates) => handleFilter(undefined, dates as [dayjs.Dayjs, dayjs.Dayjs])} />
          <Select
            placeholder="Loại giao dịch"
            style={{ width: 120 }}
            onChange={(value) => handleFilter(value)}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "import", label: "Nhập" },
              { value: "export", label: "Xuất" },
            ]}
          />
          <Button icon={<FilterOutlined />}>Lọc</Button>
        </Space>
      }
    >
      <Table
        dataSource={filteredTransactions}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giao dịch`,
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  )
}
