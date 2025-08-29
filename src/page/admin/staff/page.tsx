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
  Select,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Col,
  Avatar,
  Statistic,
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  FilterOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ProtectedRoute from "@/component/ProtectedRoute";

const { Title, Text } = Typography;
const { Search } = Input;

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  status: "active" | "inactive" | "on_leave";
  avatar?: string;
  performance: number;
  shiftsThisMonth: number;
  totalHours: number;
}

// Mock data
const initialStaff: Staff[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@restaurant.com",
    phone: "0901234567",
    position: "Phục vụ",
    department: "Phục vụ",
    salary: 8000000,
    startDate: "2023-01-15",
    status: "active",
    performance: 85,
    shiftsThisMonth: 22,
    totalHours: 176,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@restaurant.com",
    phone: "0901234568",
    position: "Đầu bếp",
    department: "Bếp",
    salary: 12000000,
    startDate: "2022-08-20",
    status: "active",
    performance: 92,
    shiftsThisMonth: 20,
    totalHours: 160,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@restaurant.com",
    phone: "0901234569",
    position: "Thu ngân",
    department: "Thu ngân",
    salary: 9000000,
    startDate: "2023-03-10",
    status: "on_leave",
    performance: 78,
    shiftsThisMonth: 15,
    totalHours: 120,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@restaurant.com",
    phone: "0901234570",
    position: "Quản lý ca",
    department: "Quản lý",
    salary: 15000000,
    startDate: "2021-12-05",
    status: "active",
    performance: 95,
    shiftsThisMonth: 25,
    totalHours: 200,
  },
];

const positions = [
  "Phục vụ",
  "Đầu bếp",
  "Thu ngân",
  "Quản lý ca",
  "Bảo vệ",
  "Tạp vụ",
];
const departments = [
  "Phục vụ",
  "Bếp",
  "Thu ngân",
  "Quản lý",
  "Bảo vệ",
  "Tạp vụ",
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" || member.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const columns = [
    {
      title: "Nhân viên",
      key: "employee",
      width: 200,
      render: (record: Staff) => (
        <div className="flex items-center gap-3">
          <Avatar size="large" icon={<UserOutlined />} src={record.avatar} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" className="text-sm">
              {record.position}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (record: Staff) => (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <MailOutlined className="text-gray-400" />
            <Text className="text-sm">{record.email}</Text>
          </div>
          <div className="flex items-center gap-1">
            <PhoneOutlined className="text-gray-400" />
            <Text className="text-sm">{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      render: (department: string) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      sorter: (a: Staff, b: Staff) => a.salary - b.salary,
      render: (salary: number) => (
        <Text strong className="text-green-600">
          {salary.toLocaleString()}đ
        </Text>
      ),
    },
    {
      title: "Hiệu suất",
      dataIndex: "performance",
      key: "performance",
      render: (performance: number) => (
        <div className="w-20">
          <Progress
            percent={performance}
            size="small"
            strokeColor={
              performance >= 80
                ? "#52c41a"
                : performance >= 60
                ? "#faad14"
                : "#ff4d4f"
            }
          />
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap = {
          active: { color: "green", text: "Đang làm việc" },
          inactive: { color: "red", text: "Nghỉ việc" },
          on_leave: { color: "orange", text: "Nghỉ phép" },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (record: Staff) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
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
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    form.setFieldsValue({
      ...staffMember,
      startDate: dayjs(staffMember.startDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id));
    message.success("Đã xóa nhân viên thành công");
  };

  const handleSubmit = async (values: any) => {
    try {
      const newStaff: Staff = {
        id: editingStaff?.id || Date.now().toString(),
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        performance: editingStaff?.performance || 0,
        shiftsThisMonth: editingStaff?.shiftsThisMonth || 0,
        totalHours: editingStaff?.totalHours || 0,
      };

      if (editingStaff) {
        setStaff(
          staff.map((member) =>
            member.id === editingStaff.id ? newStaff : member
          )
        );
        message.success("Đã cập nhật thông tin nhân viên thành công");
      } else {
        setStaff([...staff, newStaff]);
        message.success("Đã thêm nhân viên mới thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
      console.log(error);
    }
  };

  const activeStaff = staff.filter((member) => member.status === "active");
  const totalSalary = staff.reduce((sum, member) => sum + member.salary, 0);
  const avgPerformance =
    staff.reduce((sum, member) => sum + member.performance, 0) / staff.length;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={2} className="mb-2">
              Quản lý nhân viên
            </Title>
            <Text type="secondary">
              Quản lý thông tin và hiệu suất làm việc của nhân viên
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            Thêm nhân viên
          </Button>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng nhân viên"
                value={staff.length}
                valueStyle={{ color: "#1890ff" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Đang làm việc"
                value={activeStaff.length}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng lương"
                value={totalSalary}
                precision={0}
                valueStyle={{ color: "#fa8c16" }}
                suffix="đ"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Hiệu suất TB"
                value={avgPerformance}
                precision={1}
                valueStyle={{ color: "#722ed1" }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Search
              placeholder="Tìm kiếm nhân viên..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              className="flex-1 sm:flex-none"
            />
            <Select
              placeholder="Phòng ban"
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ width: 150 }}
              options={[
                { value: "all", label: "Tất cả" },
                ...departments.map((dept) => ({ value: dept, label: dept })),
              ]}
            />
            <Select
              placeholder="Trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 150 }}
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Đang làm việc" },
                { value: "on_leave", label: "Nghỉ phép" },
                { value: "inactive", label: "Nghỉ việc" },
              ]}
            />
            <Button icon={<FilterOutlined />}>Lọc nâng cao</Button>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <Table
            dataSource={filteredStaff}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} nhân viên`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={
            editingStaff
              ? "Chỉnh sửa thông tin nhân viên"
              : "Thêm nhân viên mới"
          }
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
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="position"
                  label="Chức vụ"
                  rules={[
                    { required: true, message: "Vui lòng chọn chức vụ!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn chức vụ"
                    options={positions.map((pos) => ({
                      value: pos,
                      label: pos,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="department"
                  label="Phòng ban"
                  rules={[
                    { required: true, message: "Vui lòng chọn phòng ban!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn phòng ban"
                    options={departments.map((dept) => ({
                      value: dept,
                      label: dept,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="salary"
                  label="Lương (VNĐ)"
                  rules={[{ required: true, message: "Vui lòng nhập lương!" }]}
                >
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
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="startDate"
                  label="Ngày bắt đầu làm việc"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày bắt đầu"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn trạng thái"
                    options={[
                      { value: "active", label: "Đang làm việc" },
                      { value: "on_leave", label: "Nghỉ phép" },
                      { value: "inactive", label: "Nghỉ việc" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0">
              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  {editingStaff ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
