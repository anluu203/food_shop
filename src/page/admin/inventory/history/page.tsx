
import InventoryHistory from "@/component/InventoryHistory"
import ProtectedRoute from "@/component/ProtectedRoute"
import { Typography } from "antd"


const { Title, Text } = Typography

export default function InventoryHistoryPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6 space-y-6">
          <div>
            <Title level={2} className="mb-2">
              Lịch sử nhập xuất kho
            </Title>
            <Text type="secondary">Theo dõi các giao dịch nhập xuất nguyên liệu</Text>
          </div>

          <InventoryHistory />
        </div>
    </ProtectedRoute>
  )
}
