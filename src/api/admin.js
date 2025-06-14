import request from './request';

// 登录接口
export function loginApi(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  });
}

// 获取用户信息接口
export function getInfoApi() {
  return request({
    url: '/admin/info',
    method: 'get'
  });
}

// 登出接口
export function logoutApi() {
  return request({
    url: '/admin/logout',
    method: 'post'
  });
}