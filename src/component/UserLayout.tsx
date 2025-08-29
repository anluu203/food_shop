import type React from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Typography,
  Badge,
  Card,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import clsx from "clsx";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <ShoppingCartOutlined />,
      label: "Đơn hàng",
    },
    {
      key: "/menu",
      icon: <MenuOutlined />,
      label: "Thực đơn",
    },
    {
      key: "/pos",
      icon: <ShoppingOutlined />,
      label: "Quầy bán hàng",
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
      onClick: () => navigate("/profile"),
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
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pinimg.com/736x/d7/91/df/d791df8772bb48c765f076aaab5cfdc2.jpg"
              className={clsx(
                "bg-blue-500 rounded-lg object-cover w-8 h-8",
              )}
            />
            <div>
              <Title level={4} className="mb-0 text-gray-800">
                POS Nhân viên
              </Title>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge count={2} size="small">
            <Button type="text" icon={<BellOutlined />} className="text-lg" />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="bg-green-500"
              />
              <div className="text-left hidden sm:block">
                <Space>
                  <Text strong className="block text-sm">
                    {user?.name}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    Nhân viên
                  </Text>
                </Space>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* Mobile-friendly navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="border-none"
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </div>

      <Content className="p-4">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>

      {/* Quick Stats Bar */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <Card size="small" className="bg-blue-50">
              <div className="flex items-center justify-center gap-2">
                <ClockCircleOutlined className="text-blue-500" />
                <div>
                  <Text strong className="block text-sm">
                    Ca làm
                  </Text>
                  <Text type="secondary" className="text-xs">
                    8:00 - 17:00
                  </Text>
                </div>
              </div>
            </Card>

            <Card size="small" className="bg-green-50">
              <div className="flex items-center justify-center gap-2">
                <ShoppingCartOutlined className="text-green-500" />
                <div>
                  <Text strong className="block text-sm">
                    Đơn hôm nay
                  </Text>
                  <Text type="secondary" className="text-xs">
                    12 đơn
                  </Text>
                </div>
              </div>
            </Card>

            <Card size="small" className="bg-orange-50">
              <div className="flex items-center justify-center gap-2">
                <DollarOutlined className="text-orange-500" />
                <div>
                  <Text strong className="block text-sm">
                    Doanh thu
                  </Text>
                  <Text type="secondary" className="text-xs">
                    850,000đ
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
