"use client"

import { Row, Col, Card, Statistic, Typography, Progress, Table, Tag } from "antd"
import { DollarOutlined, ShoppingCartOutlined, TeamOutlined, TrophyOutlined, ArrowUpOutlined } from "@ant-design/icons"
import ProtectedRoute from "@/component/ProtectedRoute"


const { Title, Text } = Typography

// Mock data for dashboard
const recentOrders = [
  {
    key: "1",
    orderId: "#001",
    customer: "Nguyễn Văn A",
    items: "Phở bò, Chả cá",
    amount: 150000,
    status: "completed",
    time: "10:30",
  },
  {
    key: "2",
    orderId: "#002",
    customer: "Trần Thị B",
    items: "Cơm gà, Nước ngọt",
    amount: 85000,
    status: "preparing",
    time: "10:45",
  },
  {
    key: "3",
    orderId: "#003",
    customer: "Lê Văn C",
    items: "Bún bò Huế",
    amount: 65000,
    status: "pending",
    time: "11:00",
  },
]

const columns = [
  {
    title: "Mã đơn",
    dataIndex: "orderId",
    key: "orderId",
  },
  {
    title: "Khách hàng",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Món ăn",
    dataIndex: "items",
    key: "items",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => `${amount.toLocaleString()}đ`,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const statusMap = {
        completed: { color: "green", text: "Hoàn thành" },
        preparing: { color: "orange", text: "Đang chuẩn bị" },
        pending: { color: "blue", text: "Chờ xử lý" },
      }
      const statusInfo = statusMap[status as keyof typeof statusMap]
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
    },
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
  },
]

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6">
          <div className="mb-6">
            <Title level={2} className="mb-2">
              Tổng quan hệ thống
            </Title>
            <Text type="secondary">Thống kê tổng quan về hoạt động quán ăn hôm nay</Text>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Doanh thu hôm nay"
                  value={2450000}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                />
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpOutlined className="text-green-500" />
                  <Text type="secondary" className="text-sm">
                    +12% so với hôm qua
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Đơn hàng"
                  value={45}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ShoppingCartOutlined />}
                />
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpOutlined className="text-green-500" />
                  <Text type="secondary" className="text-sm">
                    +8% so với hôm qua
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Nhân viên đang làm"
                  value={8}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<TeamOutlined />}
                />
                <div className="flex items-center gap-1 mt-2">
                  <Text type="secondary" className="text-sm">
                    Tổng: 12 nhân viên
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Món bán chạy"
                  value={28}
                  valueStyle={{ color: "#fa8c16" }}
                  prefix={<TrophyOutlined />}
                  suffix="phần"
                />
                <div className="flex items-center gap-1 mt-2">
                  <Text type="secondary" className="text-sm">
                    Phở bò
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Charts and Tables */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Đơn hàng gần đây" className="h-full">
                <Table dataSource={recentOrders} columns={columns} pagination={false} size="small" />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Hiệu suất hôm nay" className="mb-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Doanh thu</Text>
                      <Text>75%</Text>
                    </div>
                    <Progress percent={75} strokeColor="#52c41a" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Đơn hàng</Text>
                      <Text>60%</Text>
                    </div>
                    <Progress percent={60} strokeColor="#1890ff" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Khách hàng mới</Text>
                      <Text>45%</Text>
                    </div>
                    <Progress percent={45} strokeColor="#722ed1" />
                  </div>
                </div>
              </Card>

              <Card title="Cảnh báo kho">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <Text>Thịt bò</Text>
                    <Tag color="red">Sắp hết</Tag>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <Text>Rau xanh</Text>
                    <Tag color="orange">Ít</Tag>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <Text>Gạo</Text>
                    <Tag color="gold">Trung bình</Tag>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
    </ProtectedRoute>
  )
}
