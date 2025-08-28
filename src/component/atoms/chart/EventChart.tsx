import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu ví dụ
const rawData = [
  { id: 1, timeStamp: "01 - 05", resultCount: 5, description: "Tạo mới" },
  { id: 2, timeStamp: "02 - 05", resultCount: 3, description: "Sửa" },
  { id: 3, timeStamp: "03 - 05", resultCount: 8, description: "Xóa" },
  { id: 4, timeStamp: "01 - 05", resultCount: 2, description: "Tạo mới" },
  { id: 5, timeStamp: "02 - 05", resultCount: 4, description: "Xóa" },
  { id: 6, timeStamp: "03 - 05", resultCount: 1, description: "Sửa" },
  { id: 7, timeStamp: "04 - 05", resultCount: 7, description: "Tạo mới" },
  { id: 8, timeStamp: "05 - 05", resultCount: 6, description: "Sửa" },
  { id: 9, timeStamp: "06 - 05", resultCount: 5, description: "Xóa" },
  { id: 10, timeStamp: "04 - 05", resultCount: 3, description: "Tạo mới" },
  { id: 11, timeStamp: "05 - 05", resultCount: 2, description: "Xóa" },
  { id: 12, timeStamp: "06 - 05", resultCount: 4, description: "Sửa" },
  { id: 13, timeStamp: "07 - 05", resultCount: 9, description: "Tạo mới" },
  { id: 14, timeStamp: "08 - 05", resultCount: 7, description: "Sửa" },
  { id: 15, timeStamp: "09 - 05", resultCount: 10, description: "Xóa" },
  { id: 16, timeStamp: "07 - 05", resultCount: 6, description: "Tạo mới" },
  { id: 17, timeStamp: "08 - 05", resultCount: 5, description: "Xóa" },
  { id: 18, timeStamp: "09 - 05", resultCount: 4, description: "Sửa" },
  { id: 19, timeStamp: "10 - 05", resultCount: 12, description: "Tạo mới" },
  { id: 20, timeStamp: "11 - 05", resultCount: 15, description: "Sửa" },
  { id: 21, timeStamp: "12 - 05", resultCount: 8, description: "Xóa" },
  { id: 22, timeStamp: "10 - 05", resultCount: 9, description: "Tạo mới" },
  { id: 23, timeStamp: "11 - 05", resultCount: 11, description: "Xóa" },
  { id: 24, timeStamp: "12 - 05", resultCount: 13, description: "Sửa" },
];



// Nhóm dữ liệu theo loại hành động và chuẩn hóa dữ liệu
const groupDataByAction = (data: typeof rawData) => {
  const actions = Array.from(new Set(data.map((item) => item.description)));
  const dates = Array.from(new Set(data.map((item) => item.timeStamp))).sort();

  const datasets = actions.map((action, index) => {
    const actionData = dates.map((date) => {
      const item = data.find(
        (d) => d.timeStamp === date && d.description === action
      );
      return item ? item.resultCount : 0;
    });

    return {
      label: action,
      data: actionData,
      borderColor: ["#FF6384", "#36A2EB", "#FFCE56"][index], // Màu mỗi đường
      backgroundColor: "rgba(0,0,0,0)",
      borderWidth: 2,
      tension: 0.4, // Làm mềm đường (giá trị từ 0 đến 1, càng cao càng cong)
    };
  });

  return { labels: dates, datasets };
};

const EventChart = () => {
  const chartData = groupDataByAction(rawData);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Bảng thống kê hành vi người dùng được tạo trong tháng 5/2025",
      },
    },
  };

  return (
      <Line data={chartData} options={options} />
  );
};

export default EventChart;
