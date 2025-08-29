"use client"

import { useState } from "react"
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Tag,
  Modal,
  Descriptions,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  message,
} from "antd"
import {
  EyeOutlined,
  EditOutlined,
  PrinterOutlined,
  FilterOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import ProtectedRoute from "@/component/ProtectedRoute"


const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone?: string
  tableNumber?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: "cash" | "card" | "transfer"
  paymentStatus: "pending" | "paid" | "refunded"
  orderStatus: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  orderType: "dine_in" | "takeaway" | "delivery"
  createdAt: string
  completedAt?: string
  staff: string
  notes?: string
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    tableNumber: "Bàn 5",
    items: [
      { id: "1", name: "Phở bò", quantity: 1, price: 65000, total: 65000 },
      { id: "2", name: "Chả cá", quantity: 1, price: 75000, total: 75000 },
      { id: "3", name: "Nước ngọt", quantity: 2, price: 15000, total: 30000 },
    ],
    subtotal: 170000,
    tax: 17000,
    discount: 0,
    total: 187000,
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "completed",
    orderType: "dine_in",
    createdAt: "2024-01-15T10:30:00",
    completedAt: "2024-01-15T11:15:00",
    staff: "Nguyễn Văn A",
    notes: "Không hành",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerName: "Trần Thị B",
    customerPhone: "0901234568",
    items: [
      { id: "1", name: "Cơm gà", quantity: 1, price: 45000, total: 45000 },
      { id: "2", name: "Cà phê đen", quantity: 1, price: 25000, total: 25000 },
    ],
    subtotal: 70000,
    tax: 7000,
    discount: 5000,
    total: 72000,
    paymentMethod: "card",
    paymentStatus: "paid",
    orderStatus: "ready",
    orderType: "takeaway",
    createdAt: "2024-01-15T10:45:00",
    staff: "Trần Thị B",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customerName: "Lê Văn C",
    customerPhone: "0901234569",
    tableNumber: "Bàn 3",
    items: [{ id: "1", name: "Bún bò Huế", quantity: 1, price: 55000, total: 55000 }],
    subtotal: 55000,
    tax: 5500,
    discount: 0,
    total: 60500,
    paymentMethod: "transfer",
    paymentStatus: "pending",
    orderStatus: "preparing",
    orderType: "dine_in",
    createdAt: "2024-01-15T11:00:00",
    staff: "Lê Văn C",
  },
]

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === "all" || order.orderStatus === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus
    return matchesStatus && matchesPaymentStatus
  })

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0)
  const todayOrders = orders.filter((order) => dayjs(order.createdAt).isSame(dayjs(), "day")).length
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending" || order.orderStatus === "preparing",
  ).length

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 100,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (record: Order) => (
        <div>
          <Text strong>{record.customerName}</Text>
          <br />
          <Text type="secondary" className="text-xs">
            {record.tableNumber || record.orderType === "takeaway" ? "Mang về" : "Giao hàng"}
          </Text>
        </div>
      ),
    },
    {
      title: "Món ăn",
      dataIndex: "items",
      key: "items",
      render: (items: OrderItem[]) => (
        <div>
          {items.slice(0, 2).map((item, index) => (
            <div key={index} className="text-sm">
              {item.quantity}x {item.name}
            </div>
          ))}
          {items.length > 2 && (
            <Text type="secondary" className="text-xs">
              +{items.length - 2} món khác
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      sorter: (a: Order, b: Order) => a.total - b.total,
      render: (total: number) => (
        <Text strong className="text-green-600">
          {total.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Thanh toán",
      key: "payment",
      render: (record: Order) => (
        <div>
          <Tag
            color={record.paymentStatus === "paid" ? "green" : record.paymentStatus === "pending" ? "orange" : "red"}
          >
            {record.paymentStatus === "paid"
              ? "Đã thanh toán"
              : record.paymentStatus === "pending"
                ? "Chờ thanh toán"
                : "Hoàn tiền"}
          </Tag>
          <br />
          <Text type="secondary" className="text-xs">
            {record.paymentMethod === "cash" ? "Tiền mặt" : record.paymentMethod === "card" ? "Thẻ" : "Chuyển khoản"}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => {
        const statusMap = {
          pending: { color: "blue", text: "Chờ xử lý" },
          preparing: { color: "orange", text: "Đang chuẩn bị" },
          ready: { color: "green", text: "Sẵn sàng" },
          completed: { color: "gray", text: "Hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
        }
        const statusInfo = statusMap[status as keyof typeof statusMap]
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM HH:mm"),
      sorter: (a: Order, b: Order) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (record: Order) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleUpdateStatus(record)} />
          <Button type="text" size="small" icon={<PrinterOutlined />} onClick={() => handlePrint(record)} />
        </Space>
      ),
    },
  ]

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalVisible(true)
  }

  const handleUpdateStatus = (order: Order) => {
    // Implementation for updating order status
    message.info("Tính năng cập nhật trạng thái đang được phát triển")
  }

  const handlePrint = (order: Order) => {
    // Implementation for printing receipt
    message.success(`Đã in hóa đơn cho đơn hàng ${order.orderNumber}`)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Title level={2} className="mb-2">
                Quản lý đơn hàng
              </Title>
              <Text type="secondary">Theo dõi và quản lý tất cả đơn hàng trong hệ thống</Text>
            </div>
          </div>

          {/* Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Doanh thu hôm nay"
                  value={totalRevenue}
                  precision={0}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Đơn hàng hôm nay"
                  value={todayOrders}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Đang xử lý"
                  value={pendingOrders}
                  valueStyle={{ color: "#fa8c16" }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Hoàn thành"
                  value={orders.filter((o) => o.orderStatus === "completed").length}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <RangePicker placeholder={["Từ ngày", "Đến ngày"]} />
              <Select
                placeholder="Trạng thái đơn hàng"
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 150 }}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "pending", label: "Chờ xử lý" },
                  { value: "preparing", label: "Đang chuẩn bị" },
                  { value: "ready", label: "Sẵn sàng" },
                  { value: "completed", label: "Hoàn thành" },
                  { value: "cancelled", label: "Đã hủy" },
                ]}
              />
              <Select
                placeholder="Trạng thái thanh toán"
                value={selectedPaymentStatus}
                onChange={setSelectedPaymentStatus}
                style={{ width: 150 }}
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "pending", label: "Chờ thanh toán" },
                  { value: "paid", label: "Đã thanh toán" },
                  { value: "refunded", label: "Hoàn tiền" },
                ]}
              />
              <Button icon={<FilterOutlined />}>Lọc nâng cao</Button>
            </div>
          </Card>

          {/* Table */}
          <Card>
            <Table
              dataSource={filteredOrders}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>

          {/* Order Detail Modal */}
          <Modal
            title={`Chi tiết đơn hàng ${selectedOrder?.orderNumber}`}
            open={isDetailModalVisible}
            onCancel={() => setIsDetailModalVisible(false)}
            footer={[
              <Button
                key="print"
                icon={<PrinterOutlined />}
                onClick={() => selectedOrder && handlePrint(selectedOrder)}
              >
                In hóa đơn
              </Button>,
              <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                Đóng
              </Button>,
            ]}
            width={700}
          >
            {selectedOrder && (
              <div className="space-y-4">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Mã đơn hàng">{selectedOrder.orderNumber}</Descriptions.Item>
                  <Descriptions.Item label="Khách hàng">{selectedOrder.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{selectedOrder.customerPhone || "-"}</Descriptions.Item>
                  <Descriptions.Item label="Bàn/Loại">
                    {selectedOrder.tableNumber || selectedOrder.orderType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhân viên">{selectedOrder.staff}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian tạo">
                    {dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Descriptions.Item>
                </Descriptions>

                <Card title="Chi tiết món ăn" size="small">
                  <Table
                    dataSource={selectedOrder.items}
                    columns={[
                      { title: "Món ăn", dataIndex: "name", key: "name" },
                      { title: "SL", dataIndex: "quantity", key: "quantity", width: 60 },
                      {
                        title: "Đơn giá",
                        dataIndex: "price",
                        key: "price",
                        render: (price: number) => `${price.toLocaleString()}đ`,
                      },
                      {
                        title: "Thành tiền",
                        dataIndex: "total",
                        key: "total",
                        render: (total: number) => `${total.toLocaleString()}đ`,
                      },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>

                <Card title="Thanh toán" size="small">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text>Tạm tính:</Text>
                      <Text>{selectedOrder.subtotal.toLocaleString()}đ</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Thuế (10%):</Text>
                      <Text>{selectedOrder.tax.toLocaleString()}đ</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Giảm giá:</Text>
                      <Text>-{selectedOrder.discount.toLocaleString()}đ</Text>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <Text strong>Tổng cộng:</Text>
                      <Text strong className="text-green-600 text-lg">
                        {selectedOrder.total.toLocaleString()}đ
                      </Text>
                    </div>
                  </div>
                </Card>

                {selectedOrder.notes && (
                  <Card title="Ghi chú" size="small">
                    <Text>{selectedOrder.notes}</Text>
                  </Card>
                )}
              </div>
            )}
          </Modal>
        </div>
    </ProtectedRoute>
  )
}
