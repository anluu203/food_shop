import AuthService from "./auth";
import MenuService from "./menu";

const apiService = {
  auth: new AuthService(),
  menu: new MenuService(),
};

export default apiService;
