"use client"

import { useState } from "react"
import { Form, Input, Button, Card, Typography, Alert, Space } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"

const { Title, Text } = Typography

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    setError("")

    const success = await login(values.username, values.password)

    if (!success) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">
            Hệ thống ERP Quán Ăn
          </Title>
          <Text type="secondary">Đăng nhập để tiếp tục</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text strong className="block mb-2">
            Tài khoản demo:
          </Text>
          <Space direction="vertical" size="small">
            <Text>Admin: admin / 123456</Text>
            <Text>Nhân viên: staff / 123456</Text>
          </Space>
        </div>
      </Card>
    </div>
  )
}
