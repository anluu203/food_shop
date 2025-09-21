export const baseApi = "/api";

export const foodsImage = {
  pho_bo:
    "https://bizweb.dktcdn.net/100/489/006/articles/pho-bo-anh-bia.jpg?v=1698658470313",
  com_ga:
    "https://file.hstatic.net/200000700229/article/com-ga-chien-mam-toi-1_598c51ff37f84acd99f186d64e0acba0.jpg",
  bun_bo_hue:
    "https://s3-hni02.higiocloud.vn/gppm2/prod/cms/posts/cach-nau-bun-bo-hue-thom-ngon-chuan-vi/b1a08f664a9049eeac8d04d52ee4a4d9.png",
  cha_ca:
    "https://i.ytimg.com/vi/ZLwCwyIDJJ4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC28T49o72JuvhoihtNNUQvmAyCWA",
  cafe: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/bai_vietca_phe_den_bao_nhieu_calo_uong_nhieu_co_tot_khong_html_1_ebb28c9c42.png",
  nuoc_ngot:
    "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_6_5_638532030774184406_nuoc-ngot-co-ga-avt.jpg",
};


export enum StorageEnum {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  USER = 'user',
  STATUS_LOGIN = 'statusLogin',
  REMEMBER_ME = 'remember_me'
}


export enum ApiEnum {
  APP_HOME = 'app-home/api',
  APP_MENU = 'app-menu'
}