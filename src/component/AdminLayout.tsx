import type React from "react";
import { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Typography,
  Badge,
  Space,
} from "antd";
import {
  DashboardOutlined,
  MenuOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import clsx from "clsx";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Tổng quan",
    },
    {
      key: "/admin/menu",
      icon: <MenuOutlined />,
      label: "Quản lý thực đơn",
    },
    {
      key: "/admin/staff",
      icon: <TeamOutlined />,
      label: "Quản lý nhân viên",
    },
    {
      key: "/admin/inventory",
      icon: <ShoppingOutlined />,
      label: "Quản lý kho",
    },
    {
      key: "/admin/orders",
      icon: <FileTextOutlined />,
      label: "Đơn hàng",
    },
    {
      key: "/admin/analytics",
      icon: <BarChartOutlined />,
      label: "Báo cáo thống kê",
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/admin/profile"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white shadow-lg"
        width={250}
        collapsedWidth={80}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pinimg.com/736x/d7/91/df/d791df8772bb48c765f076aaab5cfdc2.jpg"
              className={clsx(
                "bg-blue-500 rounded-lg object-cover",
                collapsed ? "w-8 h-8" : "w-20 h-20"
              )}
            />
            {!collapsed && (
              <div>
                <Title level={5} className="mb-0 text-gray-800">
                  ERP Quán Ăn
                </Title>
                <Text type="secondary" className="text-xs">
                  Admin Panel
                </Text>
              </div>
            )}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="border-none mt-4"
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            <div>
              <Title level={4} className="mb-0">
                {menuItems.find((item) => item.key === location.pathname)
                  ?.label || "Tổng quan"}
              </Title>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} className="text-lg" />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <div className="text-left">
                  <Space>
                    <Text strong className="block text-sm">
                      {user?.name}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {user?.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                    </Text>
                  </Space>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm min-h-full">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
