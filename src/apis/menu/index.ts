import axiosClient from '@/apis/axios';
import { ApiEnum } from '@/helper/constants';
import { baseURL } from '@/helper/env';
import axios from 'axios';

const appMenu = ApiEnum.APP_MENU;

export default class MenuService {
  async getList(params?: any) {
    const url = `${baseURL}/${appMenu}/menu-items/`;
    return axiosClient.get(url, params);
  }
  async refreshToken(params: any) {
    const url = `${baseURL}token/refresh/`;
    return axios.post(url, params);
  }
}
