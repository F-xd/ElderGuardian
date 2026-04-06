import { post, get } from '../utils/request';

// 用户登录
export const apiLogin = (data) => post('/user/login', data);

// 用户注册
export const apiRegister = (data) => post('/user/register', data);

// 获取当前用户信息
export const apiGetUser = (id) => {
  if (id) {
    return get(`/user/get?id=${id}`);
  }
  return get('/user/get');
};

// 修改密码
export const apiChangePassword = (data) => post('/user/changePassword', data);

// 获取用户列表
export const apiGetUserList = (data) => post('/user/list', data);

// 获取老人健康数据
export const apiGetElderHealth = (data) => post('/user/health', data);

// 通过ids查询用户列表
export const apiGetUserListByIds = (userIds) => post('/user/listByIds', userIds);