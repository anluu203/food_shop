// src/pages/NotFoundPage.tsx
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm không tồn tại."
        extra={
          <Button
            type="primary"
            className="bg-[#C754A8] hover:bg-[#a7438c]"
            onClick={() => navigate("/")}
          >
            Quay về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
