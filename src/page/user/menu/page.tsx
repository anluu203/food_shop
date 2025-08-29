"use client";

import { Row, Col, Card, Typography, Button, Input, Select, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { foodsImage } from "@/helper/constants";

const { Title, Text } = Typography;
const { Search } = Input;

// Mock menu data
const menuItems = [
  {
    id: 1,
    name: "Phở bò",
    price: 65000,
    category: "Món chính",
    description: "Phở bò truyền thống với nước dùng đậm đà",
    available: true,
    image: foodsImage.pho_bo,
  },
  {
    id: 2,
    name: "Cơm gà",
    price: 45000,
    category: "Món chính",
    description: "Cơm gà Hải Nam thơm ngon",
    available: true,
    image: foodsImage.com_ga,
  },
  {
    id: 3,
    name: "Bún bò Huế",
    price: 55000,
    category: "Món chính",
    description: "Bún bò Huế cay nồng đặc trưng",
    available: false,
    image: foodsImage.bun_bo_hue,
  },
  {
    id: 4,
    name: "Chả cá",
    price: 75000,
    category: "Món phụ",
    description: "Chả cá Lã Vọng thơm lừng",
    available: true,
    image: foodsImage.cha_ca,
  },
  {
    id: 5,
    name: "Cà phê đen",
    price: 25000,
    category: "Đồ uống",
    description: "Cà phê đen đậm đà",
    available: true,
    image: foodsImage.cafe,
  },
  {
    id: 6,
    name: "Nước ngọt",
    price: 15000,
    category: "Đồ uống",
    description: "Các loại nước ngọt có gas",
    available: true,
    image: foodsImage.nuoc_ngot,
  },
];

export default function UserMenuPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title level={3} className="mb-1">
            Thực đơn
          </Title>
          <Text type="secondary">Danh sách món ăn và đồ uống hiện có</Text>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Search
            placeholder="Tìm kiếm món ăn..."
            allowClear
            style={{ width: 300 }}
            className="flex-1 sm:flex-none"
          />
          <Select
            placeholder="Danh mục"
            style={{ width: 150 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "main", label: "Món chính" },
              { value: "side", label: "Món phụ" },
              { value: "drink", label: "Đồ uống" },
            ]}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "available", label: "Còn hàng" },
              { value: "unavailable", label: "Hết hàng" },
            ]}
          />
        </div>
      </Card>

      {/* Menu Grid */}
      <Row gutter={[16, 16]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              className={`h-full ${!item.available ? "opacity-60" : ""}`}
              cover={
                <img
                  alt={item.name}
                  src={item.image || "/placeholder.svg"}
                  className="h-40 object-cover"
                />
              }
              actions={[
                <Button
                  key="add"
                  type="primary"
                  icon={<PlusOutlined />}
                  disabled={!item.available}
                  className="w-full"
                >
                  Thêm vào đơn
                </Button>,
              ]}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <Title level={5} className="mb-0">
                    {item.name}
                  </Title>
                  <Tag color={item.available ? "green" : "red"}>
                    {item.available ? "Còn hàng" : "Hết hàng"}
                  </Tag>
                </div>
                <Text type="secondary" className="text-sm">
                  {item.description}
                </Text>
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg text-green-600">
                    {item.price.toLocaleString()}đ
                  </Text>
                  <Tag>{item.category}</Tag>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
