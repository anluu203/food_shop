"use client";

import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  DatePicker,
  Select,
  Table,
} from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "@ant-design/plots";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data for analytics
const revenueData = [
  { date: "2024-01-01", revenue: 2500000 },
  { date: "2024-01-02", revenue: 3200000 },
  { date: "2024-01-03", revenue: 2800000 },
  { date: "2024-01-04", revenue: 3500000 },
  { date: "2024-01-05", revenue: 4200000 },
  { date: "2024-01-06", revenue: 3800000 },
  { date: "2024-01-07", revenue: 4500000 },
];

const categoryData = [
  { category: "Món chính", value: 45, revenue: 15000000 },
  { category: "Đồ uống", value: 30, revenue: 8000000 },
  { category: "Món phụ", value: 20, revenue: 5000000 },
  { category: "Tráng miệng", value: 5, revenue: 2000000 },
];

const topItems = [
  { rank: 1, name: "Phở bò", sold: 156, revenue: 10140000, growth: 12 },
  { rank: 2, name: "Cơm gà", sold: 134, revenue: 6030000, growth: 8 },
  { rank: 3, name: "Bún bò Huế", sold: 98, revenue: 5390000, growth: -3 },
  { rank: 4, name: "Chả cá", sold: 87, revenue: 6525000, growth: 15 },
  { rank: 5, name: "Cà phê đen", sold: 203, revenue: 5075000, growth: 22 },
];

export default function AnalyticsPage() {
  const revenueConfig = {
    data: revenueData,
    xField: "date",
    yField: "revenue",
    smooth: true,
    color: "#1890ff",
    point: {
      size: 4,
      shape: "circle",
    },
    yAxis: {
      label: {
        formatter: (v: string) =>
          `${(Number.parseInt(v) / 1000000).toFixed(1)}M`,
      },
    },
  };

  const categoryConfig = {
    data: categoryData,
    angleField: "value",
    colorField: "category",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  };

  const topItemsColumns = [
    {
      title: "Hạng",
      dataIndex: "rank",
      key: "rank",
      width: 60,
      render: (rank: number) => (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
          <Text strong className="text-blue-600">
            {rank}
          </Text>
        </div>
      ),
    },
    {
      title: "Món ăn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      render: (sold: number) => `${sold} phần`,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => (
        <Text strong className="text-green-600">
          {revenue.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Tăng trưởng",
      dataIndex: "growth",
      key: "growth",
      render: (growth: number) => (
        <div className="flex items-center gap-1">
          {growth > 0 ? (
            <ArrowUpOutlined className="text-green-500" />
          ) : (
            <ArrowDownOutlined className="text-red-500" />
          )}
          <Text className={growth > 0 ? "text-green-500" : "text-red-500"}>
            {Math.abs(growth)}%
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title level={2} className="mb-2">
            Báo cáo thống kê
          </Title>
          <Text type="secondary">
            Phân tích doanh thu và hiệu suất kinh doanh
          </Text>
        </div>
        <div className="flex gap-4">
          <RangePicker />
          <Select
            defaultValue="7days"
            style={{ width: 120 }}
            options={[
              { value: "7days", label: "7 ngày" },
              { value: "30days", label: "30 ngày" },
              { value: "3months", label: "3 tháng" },
              { value: "1year", label: "1 năm" },
            ]}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Doanh thu tuần này"
              value={25200000}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="đ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpOutlined className="text-green-500" />
              <Text type="secondary" className="text-sm">
                +15% so với tuần trước
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={342}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ShoppingCartOutlined />}
            />
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpOutlined className="text-green-500" />
              <Text type="secondary" className="text-sm">
                +8% so với tuần trước
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Khách hàng mới"
              value={89}
              valueStyle={{ color: "#722ed1" }}
              prefix={<UserOutlined />}
            />
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpOutlined className="text-green-500" />
              <Text type="secondary" className="text-sm">
                +23% so với tuần trước
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Giá trị TB/Đơn"
              value={73684}
              precision={0}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<TrophyOutlined />}
              suffix="đ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpOutlined className="text-green-500" />
              <Text type="secondary" className="text-sm">
                +5% so với tuần trước
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ doanh thu theo ngày">
            <Line {...revenueConfig} height={300} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Doanh thu theo danh mục">
            <Pie {...categoryConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Top Selling Items */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top món bán chạy">
            <Table
              dataSource={topItems}
              columns={topItemsColumns}
              pagination={false}
              size="small"
              rowKey="rank"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Hiệu suất theo giờ">
            <div className="space-y-4">
              {[
                {
                  time: "6:00 - 9:00",
                  orders: 45,
                  revenue: 2100000,
                  percentage: 85,
                },
                {
                  time: "9:00 - 12:00",
                  orders: 89,
                  revenue: 4200000,
                  percentage: 95,
                },
                {
                  time: "12:00 - 15:00",
                  orders: 156,
                  revenue: 7800000,
                  percentage: 100,
                },
                {
                  time: "15:00 - 18:00",
                  orders: 78,
                  revenue: 3900000,
                  percentage: 70,
                },
                {
                  time: "18:00 - 21:00",
                  orders: 134,
                  revenue: 6700000,
                  percentage: 90,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <Text strong>{item.time}</Text>
                    <br />
                    <Text type="secondary" className="text-sm">
                      {item.orders} đơn • {item.revenue.toLocaleString()}đ
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text strong className="text-blue-600">
                      {item.percentage}%
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
