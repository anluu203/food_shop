import axiosClient from '@/apis/axios';
import { ApiEnum } from '@/helper/constants';
import { baseURL } from '@/helper/env';
import axios from 'axios';

const appHome = ApiEnum.APP_HOME;
export default class AuthService {
  async login(params: any) {
    const url = `${appHome}/token/`;
    return axiosClient.post(url, params);
  }
  async refreshToken(params: any) {
    const url = `${baseURL}token/refresh/`;
    return axios.post(url, params);
  }
}
