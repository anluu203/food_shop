import { useEffect } from "react";
import { Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import apiService from "./apis";

export default function App() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const fetchMenu = () =>{
    apiService.menu.getList();
  }
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    fetchMenu();
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return null;
}
