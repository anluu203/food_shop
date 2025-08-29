"use client"

import { useState } from "react"
import { Card, List, Button, Input, Modal, Form, message, Typography, Tag } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"

const {  Text } = Typography

interface Category {
  id: string
  name: string
  description?: string
  itemCount: number
}

const initialCategories: Category[] = [
  { id: "1", name: "Món chính", description: "Các món ăn chính", itemCount: 3 },
  { id: "2", name: "Món phụ", description: "Các món ăn phụ", itemCount: 1 },
  { id: "3", name: "Đồ uống", description: "Nước uống các loại", itemCount: 2 },
  { id: "4", name: "Tráng miệng", description: "Món tráng miệng", itemCount: 0 },
]

export default function MenuCategoryManager() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setEditingCategory(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue(category)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    const category = categories.find((cat) => cat.id === id)
    if (category && category.itemCount > 0) {
      message.warning("Không thể xóa danh mục đang có món ăn")
      return
    }
    setCategories(categories.filter((cat) => cat.id !== id))
    message.success("Đã xóa danh mục thành công")
  }

  const handleSubmit = async (values: any) => {
    try {
      const newCategory: Category = {
        id: editingCategory?.id || Date.now().toString(),
        ...values,
        itemCount: editingCategory?.itemCount || 0,
      }

      if (editingCategory) {
        setCategories(categories.map((cat) => (cat.id === editingCategory.id ? newCategory : cat)))
        message.success("Đã cập nhật danh mục thành công")
      } else {
        setCategories([...categories, newCategory])
        message.success("Đã thêm danh mục thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  return (
    <Card
      title="Quản lý danh mục"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm danh mục
        </Button>
      }
    >
      <List
        dataSource={categories}
        renderItem={(category) => (
          <List.Item
            key={category.id}
            actions={[
              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(category)} />,
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(category.id)}
                disabled={category.itemCount > 0}
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <div className="flex items-center gap-2">
                  <Text strong>{category.name}</Text>
                  <Tag color="blue">{category.itemCount} món</Tag>
                </div>
              }
              description={category.description}
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả danh mục" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
