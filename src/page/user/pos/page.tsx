"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Input,
  Select,
  Table,
  InputNumber,
  Modal,
  Form,
  Radio,
  message,
  Divider,
  Space,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  PrinterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { foodsImage } from "@/helper/constants";

const { Title, Text } = Typography;
const { Search } = Input;

interface MenuItem {
  id:  string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  description?:string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  total: number;
}

// Mock menu data
const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Phở bò",
    price: 65000,
    category: "Món chính",
    description: "Phở bò truyền thống với nước dùng đậm đà",
    available: true,
    image: foodsImage.pho_bo,
  },
  {
    id: "2",
    name: "Cơm gà",
    price: 45000,
    category: "Món chính",
    description: "Cơm gà Hải Nam thơm ngon",
    available: true,
    image: foodsImage.com_ga,
  },
  {
    id: "3",
    name: "Bún bò Huế",
    price: 55000,
    category: "Món chính",
    description: "Bún bò Huế cay nồng đặc trưng",
    available: false,
    image: foodsImage.bun_bo_hue,
  },
  {
    id: "4",
    name: "Chả cá",
    price: 75000,
    category: "Món phụ",
    description: "Chả cá Lã Vọng thơm lừng",
    available: true,
    image: foodsImage.cha_ca,
  },
  {
    id: "5",
    name: "Cà phê đen",
    price: 25000,
    category: "Đồ uống",
    description: "Cà phê đen đậm đà",
    available: true,
    image: foodsImage.cafe,
  },
  {
    id: "6",
    name: "Nước ngọt",
    price: 15000,
    category: "Đồ uống",
    description: "Các loại nước ngọt có gas",
    available: true,
    image: foodsImage.nuoc_ngot,
  },
];

const categories = ["Tất cả", "Món chính", "Món phụ", "Đồ uống"];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchText, setSearchText] = useState("");
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      const newCartItem: CartItem = {
        ...item,
        quantity: 1,
        total: item.price,
      };
      setCart([...cart, newCartItem]);
    }
    message.success(`Đã thêm ${item.name} vào giỏ hàng`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              total: item.price * quantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    message.success("Đã xóa tất cả món khỏi giỏ hàng");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const cartColumns = [
    {
      title: "Món ăn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (record: CartItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
          />
          <InputNumber
            size="small"
            min={1}
            value={record.quantity}
            onChange={(value) => updateQuantity(record.id, value || 1)}
            style={{ width: 60 }}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
          />
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <Text strong className="text-green-600">
          {total.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (record: CartItem) => (
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          danger
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  const handleCheckout = async (values: any) => {
    try {
      // Mock order creation
      const orderData = {
        items: cart,
        customer: values.customerName,
        phone: values.customerPhone,
        table: values.tableNumber,
        orderType: values.orderType,
        paymentMethod: values.paymentMethod,
        subtotal,
        tax,
        total,
        notes: values.notes,
      };

      console.log("Order created:", orderData);
      message.success("Đã tạo đơn hàng thành công!");

      // Clear cart and close modal
      setCart([]);
      setIsCheckoutModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error("Có lỗi xảy ra khi tạo đơn hàng");
      console.log(error);
      
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title level={3} className="mb-0">
          Điểm bán hàng (POS)
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {/* Menu Section */}
        <Col xs={24} lg={14}>
          <Card title="Thực đơn" className="h-full">
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Search
                  placeholder="Tìm kiếm món ăn..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: 150 }}
                  options={categories.map((cat) => ({
                    value: cat,
                    label: cat,
                  }))}
                />
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredMenu.map((item) => (
                  <Card
                    key={item.id}
                    size="small"
                    hoverable
                    cover={
                      <img
                        alt={item.name}
                        src={item.image || "/placeholder.svg"}
                        className="h-24 object-cover"
                      />
                    }
                    actions={[
                      <Button
                        key="add"
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                      >
                        Thêm
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Text strong className="text-sm">
                          {item.name}
                        </Text>
                      }
                      description={
                        <Text strong className="text-green-600">
                          {item.price.toLocaleString()}đ
                        </Text>
                      }
                    />
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Cart Section */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <div className="flex items-center justify-between">
                <span>Giỏ hàng ({cart.length})</span>
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  Xóa tất cả
                </Button>
              </div>
            }
            className="h-full"
          >
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartOutlined className="text-4xl text-gray-300 mb-2" />
                  <Text type="secondary">Giỏ hàng trống</Text>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto">
                    <Table
                      dataSource={cart}
                      columns={cartColumns}
                      pagination={false}
                      size="small"
                      rowKey="id"
                    />
                  </div>

                  <Divider />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text>Tạm tính:</Text>
                      <Text>{subtotal.toLocaleString()}đ</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Thuế (10%):</Text>
                      <Text>{tax.toLocaleString()}đ</Text>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <Text strong>Tổng cộng:</Text>
                      <Text strong className="text-green-600 text-lg">
                        {total.toLocaleString()}đ
                      </Text>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => setIsCheckoutModalVisible(true)}
                  >
                    Thanh toán
                  </Button>
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <Modal
        title="Thanh toán đơn hàng"
        open={isCheckoutModalVisible}
        onCancel={() => setIsCheckoutModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCheckout}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khách hàng!" },
                ]}
              >
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="customerPhone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="orderType"
                label="Loại đơn hàng"
                rules={[
                  { required: true, message: "Vui lòng chọn loại đơn hàng!" },
                ]}
              >
                <Radio.Group>
                  <Radio value="dine_in">Tại bàn</Radio>
                  <Radio value="takeaway">Mang về</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="tableNumber" label="Số bàn">
                <Select
                  placeholder="Chọn bàn"
                  options={Array.from({ length: 20 }, (_, i) => ({
                    value: `Bàn ${i + 1}`,
                    label: `Bàn ${i + 1}`,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="paymentMethod"
            label="Phương thức thanh toán"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phương thức thanh toán!",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="cash">Tiền mặt</Radio>
              <Radio value="card">Thẻ</Radio>
              <Radio value="transfer">Chuyển khoản</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú đặc biệt..." />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="flex justify-between mb-2">
              <Text>Tạm tính:</Text>
              <Text>{subtotal.toLocaleString()}đ</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Thuế:</Text>
              <Text>{tax.toLocaleString()}đ</Text>
            </div>
            <div className="flex justify-between border-t pt-2">
              <Text strong>Tổng cộng:</Text>
              <Text strong className="text-green-600 text-lg">
                {total.toLocaleString()}đ
              </Text>
            </div>
          </div>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsCheckoutModalVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PrinterOutlined />}
              >
                Thanh toán & In hóa đơn
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
