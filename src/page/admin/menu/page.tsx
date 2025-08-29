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
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  message,
  Popconfirm,
  Row,
  Col,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FilterOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd/es/upload/interface"
import ProtectedRoute from "@/component/ProtectedRoute"
import { foodsImage } from "@/helper/constants"


const { Title, Text } = Typography
const { Search } = Input
const { TextArea } = Input

interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  description: string
  available: boolean
  image?: string
}

// Mock data
const initialMenuItems: MenuItem[] = [
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
]

const categories = ["Món chính", "Món phụ", "Đồ uống", "Tráng miệng"]

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string) => (
        <img src={image || "/placeholder.svg"} alt="Menu item" className="w-12 h-12 object-cover rounded" />
      ),
    },
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      sorter: (a: MenuItem, b: MenuItem) => a.name.localeCompare(b.name),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: MenuItem, b: MenuItem) => a.price - b.price,
      render: (price: number) => (
        <Text strong className="text-green-600">
          {price.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "available",
      key: "available",
      render: (available: boolean) => (
        <Tag color={available ? "green" : "red"}>{available ? "Còn hàng" : "Hết hàng"}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (record: MenuItem) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa món ăn"
            description="Bạn có chắc chắn muốn xóa món ăn này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setFileList([])
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    form.setFieldsValue(item)
    setFileList(
      item.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: item.image,
            },
          ]
        : [],
    )
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
    message.success("Đã xóa món ăn thành công")
  }

  const handleSubmit = async (values: any) => {
    try {
      const newItem: MenuItem = {
        id: editingItem?.id || Date.now().toString(),
        ...values,
        image: fileList[0]?.url || fileList[0]?.response?.url || editingItem?.image,
      }

      if (editingItem) {
        setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? newItem : item)))
        message.success("Đã cập nhật món ăn thành công")
      } else {
        setMenuItems([...menuItems, newItem])
        message.success("Đã thêm món ăn thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setFileList([])
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList)
    },
    beforeUpload: () => false, // Prevent auto upload
    maxCount: 1,
    accept: "image/*",
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Title level={2} className="mb-2">
                Quản lý thực đơn
              </Title>
              <Text type="secondary">Quản lý các món ăn và đồ uống trong thực đơn</Text>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
              Thêm món mới
            </Button>
          </div>

          {/* Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <Title level={3} className="mb-1 text-blue-600">
                    {menuItems.length}
                  </Title>
                  <Text type="secondary">Tổng số món</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <Title level={3} className="mb-1 text-green-600">
                    {menuItems.filter((item) => item.available).length}
                  </Title>
                  <Text type="secondary">Còn hàng</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <Title level={3} className="mb-1 text-red-600">
                    {menuItems.filter((item) => !item.available).length}
                  </Title>
                  <Text type="secondary">Hết hàng</Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Search
                placeholder="Tìm kiếm món ăn..."
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
                options={[{ value: "all", label: "Tất cả" }, ...categories.map((cat) => ({ value: cat, label: cat }))]}
              />
              <Button icon={<FilterOutlined />}>Lọc nâng cao</Button>
            </div>
          </Card>

          {/* Table */}
          <Card>
            <Table
              dataSource={filteredItems}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} món ăn`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>

          {/* Add/Edit Modal */}
          <Modal
            title={editingItem ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Tên món"
                    rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}
                  >
                    <Input placeholder="Nhập tên món ăn" />
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
                      options={categories.map((cat) => ({ value: cat, label: cat }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
                  <InputNumber<number>
                    placeholder="Nhập lương"
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
                <Col xs={24} sm={12}>
                  <Form.Item name="available" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Còn hàng" unCheckedChildren="Hết hàng" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Mô tả">
                <TextArea rows={3} placeholder="Nhập mô tả món ăn" />
              </Form.Item>

              <Form.Item label="Hình ảnh">
                <Upload {...uploadProps} listType="picture">
                  <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                </Upload>
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
    </ProtectedRoute>
  )
}
