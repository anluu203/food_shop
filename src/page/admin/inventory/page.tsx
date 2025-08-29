"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
  expiryDate?: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

// Mock data
const initialInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Thịt bò",
    category: "Thịt",
    unit: "kg",
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    unitPrice: 350000,
    supplier: "Công ty Thịt Sạch ABC",
    lastUpdated: "2024-01-15",
    expiryDate: "2024-01-20",
    status: "low_stock",
  },
  {
    id: "2",
    name: "Gạo tẻ",
    category: "Ngũ cốc",
    unit: "kg",
    currentStock: 100,
    minStock: 20,
    maxStock: 200,
    unitPrice: 25000,
    supplier: "Gạo Việt Nam",
    lastUpdated: "2024-01-14",
    status: "in_stock",
  },
  {
    id: "3",
    name: "Rau xanh",
    category: "Rau củ",
    unit: "kg",
    currentStock: 8,
    minStock: 15,
    maxStock: 30,
    unitPrice: 20000,
    supplier: "Nông trại Xanh",
    lastUpdated: "2024-01-15",
    expiryDate: "2024-01-17",
    status: "low_stock",
  },
  {
    id: "4",
    name: "Nước mắm",
    category: "Gia vị",
    unit: "chai",
    currentStock: 0,
    minStock: 5,
    maxStock: 20,
    unitPrice: 45000,
    supplier: "Nước mắm Phú Quốc",
    lastUpdated: "2024-01-10",
    status: "out_of_stock",
  },
  {
    id: "5",
    name: "Cà phê",
    category: "Đồ uống",
    unit: "kg",
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unitPrice: 180000,
    supplier: "Cà phê Highlands",
    lastUpdated: "2024-01-12",
    status: "in_stock",
  },
];

const categories = ["Thịt", "Rau củ", "Ngũ cốc", "Gia vị", "Đồ uống", "Khác"];
const units = ["kg", "gram", "lít", "chai", "hộp", "gói", "cái"];
const suppliers = [
  "Công ty Thịt Sạch ABC",
  "Gạo Việt Nam",
  "Nông trại Xanh",
  "Nước mắm Phú Quốc",
  "Cà phê Highlands",
];

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockItems = inventory.filter(
    (item) => item.status === "low_stock" || item.status === "out_of_stock"
  );
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0
  );
  const inStockItems = inventory.filter(
    (item) => item.status === "in_stock"
  ).length;

  const columns = [
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      sorter: (a: InventoryItem, b: InventoryItem) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Tồn kho",
      key: "stock",
      render: (record: InventoryItem) => (
        <div>
          <Text
            strong
            className={
              record.currentStock <= record.minStock
                ? "text-red-500"
                : "text-green-600"
            }
          >
            {record.currentStock} {record.unit}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            Min: {record.minStock} | Max: {record.maxStock}
          </Text>
        </div>
      ),
    },
    {
      title: "Giá đơn vị",
      dataIndex: "unitPrice",
      key: "unitPrice",
      sorter: (a: InventoryItem, b: InventoryItem) => a.unitPrice - b.unitPrice,
      render: (price: number) => (
        <Text strong className="text-green-600">
          {price.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          in_stock: { color: "green", text: "Còn hàng" },
          low_stock: { color: "orange", text: "Sắp hết" },
          out_of_stock: { color: "red", text: "Hết hàng" },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => {
        if (!date) return <Text type="secondary">-</Text>;
        const isExpiringSoon = dayjs(date).diff(dayjs(), "days") <= 3;
        return (
          <Text className={isExpiringSoon ? "text-red-500" : ""}>
            {dayjs(date).format("DD/MM/YYYY")}
            {isExpiringSoon && <WarningOutlined className="ml-1" />}
          </Text>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (record: InventoryItem) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa nguyên liệu"
            description="Bạn có chắc chắn muốn xóa nguyên liệu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      expiryDate: item.expiryDate ? dayjs(item.expiryDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
    message.success("Đã xóa nguyên liệu thành công");
  };

  const handleSubmit = async (values: any) => {
    try {
      const currentStock = values.currentStock || 0;
      const minStock = values.minStock || 0;
      let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";

      if (currentStock === 0) {
        status = "out_of_stock";
      } else if (currentStock <= minStock) {
        status = "low_stock";
      }

      const newItem: InventoryItem = {
        id: editingItem?.id || Date.now().toString(),
        ...values,
        expiryDate: values.expiryDate
          ? values.expiryDate.format("YYYY-MM-DD")
          : undefined,
        lastUpdated: dayjs().format("YYYY-MM-DD"),
        status,
      };

      if (editingItem) {
        setInventory(
          inventory.map((item) => (item.id === editingItem.id ? newItem : item))
        );
        message.success("Đã cập nhật nguyên liệu thành công");
      } else {
        setInventory([...inventory, newItem]);
        message.success("Đã thêm nguyên liệu mới thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title level={2} className="mb-2">
            Quản lý tồn kho
          </Title>
          <Text type="secondary">
            Quản lý nguyên liệu và theo dõi tình trạng tồn kho
          </Text>
        </div>
        <Space>
          <Button icon={<ImportOutlined />}>Nhập kho</Button>
          <Button icon={<ExportOutlined />}>Xuất kho</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm nguyên liệu
          </Button>
        </Space>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert
          message={`Cảnh báo: ${lowStockItems.length} nguyên liệu sắp hết hoặc đã hết hàng`}
          description={
            <div className="mt-2">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="text-sm">
                  • {item.name}: {item.currentStock} {item.unit} (tối thiểu:{" "}
                  {item.minStock} {item.unit})
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <div className="text-sm">
                  ... và {lowStockItems.length - 3} mục khác
                </div>
              )}
            </div>
          }
          type="warning"
          showIcon
          closable
        />
      )}

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng nguyên liệu"
              value={inventory.length}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Còn hàng"
              value={inStockItems}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Cảnh báo"
              value={lowStockItems.length}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={totalValue}
              precision={0}
              valueStyle={{ color: "#722ed1" }}
              suffix="đ"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Search
            placeholder="Tìm kiếm nguyên liệu..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            className="flex-1 sm:flex-none"
          />
          <Select
            placeholder="Danh mục"
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 150 }}
            options={[
              { value: "all", label: "Tất cả" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />
          <Select
            placeholder="Trạng thái"
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 150 }}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "in_stock", label: "Còn hàng" },
              { value: "low_stock", label: "Sắp hết" },
              { value: "out_of_stock", label: "Hết hàng" },
            ]}
          />
          <Button icon={<FilterOutlined />}>Lọc nâng cao</Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table
          dataSource={filteredInventory}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nguyên liệu`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingItem ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Tên nguyên liệu"
                rules={[
                  { required: true, message: "Vui lòng nhập tên nguyên liệu!" },
                ]}
              >
                <Input placeholder="Nhập tên nguyên liệu" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  options={categories.map((cat) => ({
                    value: cat,
                    label: cat,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="currentStock"
                label="Số lượng hiện tại"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber
                  placeholder="Số lượng"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="minStock"
                label="Tồn kho tối thiểu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tồn kho tối thiểu!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Tối thiểu"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="maxStock"
                label="Tồn kho tối đa"
                rules={[
                  { required: true, message: "Vui lòng nhập tồn kho tối đa!" },
                ]}
              >
                <InputNumber
                  placeholder="Tối đa"
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="unit"
                label="Đơn vị"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị!" }]}
              >
                <Select
                  placeholder="Chọn đơn vị"
                  options={units.map((unit) => ({ value: unit, label: unit }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="unitPrice"
                label="Giá đơn vị (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                  <InputNumber<number>
                    placeholder="Nhập giá"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) =>
                      value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0
                    }
                    style={{ width: "100%" }}
                    min={0}
                  />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="expiryDate" label="Hạn sử dụng">
                <DatePicker
                  placeholder="Chọn ngày hết hạn"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="supplier"
            label="Nhà cung cấp"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
          >
            <Select
              placeholder="Chọn nhà cung cấp"
              options={suppliers.map((supplier) => ({
                value: supplier,
                label: supplier,
              }))}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
