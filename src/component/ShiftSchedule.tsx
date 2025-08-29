"use client"

import { useState } from "react"
import { Card, Calendar, Badge, Modal, Form, Select, TimePicker, Button, message, Typography } from "antd"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"

const { Title, Text } = Typography

interface Shift {
  id: string
  staffId: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  position: string
  status: "scheduled" | "completed" | "absent"
}

const mockShifts: Shift[] = [
  {
    id: "1",
    staffId: "1",
    staffName: "Nguyễn Văn A",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "16:00",
    position: "Phục vụ",
    status: "completed",
  },
  {
    id: "2",
    staffId: "2",
    staffName: "Trần Thị B",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "18:00",
    position: "Đầu bếp",
    status: "completed",
  },
  {
    id: "3",
    staffId: "1",
    staffName: "Nguyễn Văn A",
    date: "2024-01-16",
    startTime: "08:00",
    endTime: "16:00",
    position: "Phục vụ",
    status: "scheduled",
  },
]

const mockStaff = [
  { id: "1", name: "Nguyễn Văn A", position: "Phục vụ" },
  { id: "2", name: "Trần Thị B", position: "Đầu bếp" },
  { id: "3", name: "Lê Văn C", position: "Thu ngân" },
  { id: "4", name: "Phạm Thị D", position: "Quản lý ca" },
]

export default function ShiftSchedule() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [form] = Form.useForm()

  const getShiftsForDate = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD")
    return shifts.filter((shift) => shift.date === dateStr)
  }

  const dateCellRender = (date: Dayjs) => {
    const dayShifts = getShiftsForDate(date)
    return (
      <div className="space-y-1">
        {dayShifts.map((shift) => (
          <Badge
            key={shift.id}
            status={shift.status === "completed" ? "success" : shift.status === "scheduled" ? "processing" : "error"}
            text={
              <span className="text-xs">
                {shift.staffName} ({shift.startTime}-{shift.endTime})
              </span>
            }
          />
        ))}
      </div>
    )
  }

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date.format("YYYY-MM-DD"))
    setIsModalVisible(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      const staff = mockStaff.find((s) => s.id === values.staffId)
      const newShift: Shift = {
        id: Date.now().toString(),
        staffId: values.staffId,
        staffName: staff?.name || "",
        date: selectedDate,
        startTime: values.timeRange[0].format("HH:mm"),
        endTime: values.timeRange[1].format("HH:mm"),
        position: staff?.position || "",
        status: "scheduled",
      }

      setShifts([...shifts, newShift])
      message.success("Đã thêm ca làm việc thành công")
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  return (
    <Card title="Lịch làm việc" className="h-full">
      <Calendar dateCellRender={dateCellRender} onSelect={handleDateSelect} className="border-0" />

      <Modal
        title={`Thêm ca làm việc - ${dayjs(selectedDate).format("DD/MM/YYYY")}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="staffId" label="Nhân viên" rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}>
            <Select
              placeholder="Chọn nhân viên"
              options={mockStaff.map((staff) => ({
                value: staff.id,
                label: `${staff.name} - ${staff.position}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Giờ làm việc"
            rules={[{ required: true, message: "Vui lòng chọn giờ làm việc!" }]}
          >
            <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Thêm ca
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
