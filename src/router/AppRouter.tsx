import AdminLayout from "@/component/AdminLayout";
import NotFoundPage from "@/component/layouts/404";
import UserLayout from "@/component/UserLayout";
import LoginPage from "@/page/login/page";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "@/page/admin/page";
import UserMenuPage from "@/page/user/menu/page";
import POSPage from "@/page/user/pos/page";
import UserDashboard from "@/page/user/page";
import InventoryManagementPage from "@/page/admin/inventory/page";
import InventoryHistoryPage from "@/page/admin/inventory/history/page";
import AnalyticsPage from "@/page/admin/analytics/page";
import OrdersManagementPage from "@/page/admin/orders/page";
import StaffManagementPage from "@/page/admin/staff/page";
import StaffSchedulePage from "@/page/admin/staff/schedule/page";
import MenuCategoriesPage from "@/page/admin/menu/categories/page";
import MenuManagementPage from "@/page/admin/menu/page";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />

      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="menu" element={<UserMenuPage />} />
        <Route path="pos" element={<POSPage />} />
      </Route>
      {/*router dashboard*/}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="inventory" element={<InventoryManagementPage />} />
        <Route path="inventory/history" element={<InventoryHistoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="orders" element={<OrdersManagementPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="staff/schedule" element={<StaffSchedulePage />} />
        <Route path="menu" element={<MenuManagementPage />} />
        <Route path="menu/categories" element={<MenuCategoriesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
