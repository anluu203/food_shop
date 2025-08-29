"use client"

import ProtectedRoute from "@/component/ProtectedRoute"
import ShiftSchedule from "@/component/ShiftSchedule"
import { Typography } from "antd"


const { Title, Text } = Typography

export default function StaffSchedulePage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6 space-y-6">
          <div>
            <Title level={2} className="mb-2">
              Lịch làm việc nhân viên
            </Title>
            <Text type="secondary">Quản lý ca làm việc và lịch trình của nhân viên</Text>
          </div>

          <ShiftSchedule />
        </div>
    </ProtectedRoute>
  )
}
