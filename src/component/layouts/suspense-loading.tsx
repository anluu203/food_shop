import { Spin } from "antd";

const SuspenseLoading = () => {
  return (
    <div className="h-screen w-screen bg-white flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
};

export default SuspenseLoading;
