"use client";

import MenuCategoryManager from "@/component/MenuCategoryManager";
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function MenuCategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <Title level={2} className="mb-2">
          Quản lý danh mục thực đơn
        </Title>
        <Text type="secondary">Quản lý các danh mục món ăn trong hệ thống</Text>
      </div>

      <MenuCategoryManager />
    </div>
  );
}
