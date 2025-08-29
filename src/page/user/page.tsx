"use client";

import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Table,
  Tag,
  Space,
  Input,
  Select,
} from "antd";
import {
  PlusOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

// Mock data for orders
const orders = [
  {
    key: "1",
    orderId: "#001",
    table: "Bàn 5",
    items: ["Phở bò", "Chả cá", "Nước ngọt"],
    total: 150000,
    status: "preparing",
    time: "10:30",
    customer: "Nguyễn Văn An",
  },
  {
    key: "2",
    orderId: "#002",
    table: "Bàn 3",
    items: ["Cơm gà", "Canh chua"],
    total: 85000,
    status: "ready",
    time: "10:45",
    customer: "Trần Thị Bính",
  },
  {
    key: "3",
    orderId: "#003",
    table: "Mang về",
    items: ["Bún bò Huế"],
    total: 65000,
    status: "completed",
    time: "11:00",
    customer: "Lê Văn Can",
  },
  {
    key: "4",
    orderId: "#004",
    table: "Bàn 7",
    items: ["Bánh mì", "Cà phê"],
    total: 45000,
    status: "pending",
    time: "11:15",
    customer: "Phạm Thị Diên",
  },
];

const columns = [
  {
    title: "Mã đơn",
    dataIndex: "orderId",
    key: "orderId",
    width: 80,
  },
  {
    title: "Bàn/Khách",
    key: "tableCustomer",
    width: 120,
    render: (record: any) => (
      <div>
        <Text strong>{record.table}</Text>
        <br />
        <Text type="secondary" className="text-xs">
          {record.customer}
        </Text>
      </div>
    ),
  },
  {
    title: "Món ăn",
    dataIndex: "items",
    key: "items",
    render: (items: string[]) => (
      <div>
        {items.map((item, index) => (
          <div key={index} className="text-sm">
            {item}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Tổng tiền",
    dataIndex: "total",
    key: "total",
    width: 100,
    render: (total: number) => (
      <Text strong className="text-green-600">
        {total.toLocaleString()}đ
      </Text>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: string) => {
      const statusMap = {
        pending: { color: "blue", text: "Chờ xử lý" },
        preparing: { color: "orange", text: "Đang chuẩn bị" },
        ready: { color: "green", text: "Sẵn sàng" },
        completed: { color: "gray", text: "Hoàn thành" },
      };
      const statusInfo = statusMap[status as keyof typeof statusMap];
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    },
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
    width: 80,
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 120,
    render: (record: any) => (
      <Space size="small">
        <Button type="text" size="small" icon={<EyeOutlined />} />
        <Button type="text" size="small" icon={<EditOutlined />} />
        {record.status === "ready" && (
          <Button
            type="text"
            size="small"
            icon={<CheckCircleOutlined />}
            className="text-green-500"
          />
        )}
      </Space>
    ),
  },
];

export default function UserDashboard() {
  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title level={3} className="mb-1">
            Quản lý đơn hàng
          </Title>
          <Text type="secondary">
            Theo dõi và xử lý các đơn hàng trong ca làm việc
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="w-full sm:w-auto"
        >
          Tạo đơn mới
        </Button>
      </div>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-blue-50">
            <div className="text-blue-500 text-2xl mb-2">
              <PlusOutlined />
            </div>
            <Text strong>Đơn mới</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer border-orange-200 bg-orange-50">
            <div className="text-orange-500 text-2xl mb-2">
              <FilterOutlined />
            </div>
            <Text strong>Đang chuẩn bị</Text>
            <br />
            <Text type="secondary" className="text-xs">
              3 đơn
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer border-green-200 bg-green-50">
            <div className="text-green-500 text-2xl mb-2">
              <CheckCircleOutlined />
            </div>
            <Text strong>Sẵn sàng</Text>
            <br />
            <Text type="secondary" className="text-xs">
              1 đơn
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer border-gray-200 bg-gray-50">
            <div className="text-gray-500 text-2xl mb-2">
              <EyeOutlined />
            </div>
            <Text strong>Xem tất cả</Text>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Search
            placeholder="Tìm kiếm đơn hàng..."
            allowClear
            style={{ width: 300 }}
            className="flex-1 sm:flex-none"
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "pending", label: "Chờ xử lý" },
              { value: "preparing", label: "Đang chuẩn bị" },
              { value: "ready", label: "Sẵn sàng" },
              { value: "completed", label: "Hoàn thành" },
            ]}
          />
          <Select
            placeholder="Bàn"
            style={{ width: 120 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "table", label: "Tại bàn" },
              { value: "takeaway", label: "Mang về" },
            ]}
          />
        </div>
      </Card>

      {/* Orders Table */}
      <Card title="Danh sách đơn hàng" className="overflow-hidden">
        <Table
          dataSource={orders}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>
    </div>
  );
}
