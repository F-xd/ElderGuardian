import Taro from '@tarojs/taro';

// API基础URL
const BASE_URL = 'http://192.168.50.219:8080';
// const BASE_URL = 'http://locallhost:8080';

// 封装网络请求
const request = async (url, options = {}) => {
  // 获取token
  const token = Taro.getStorageSync('token');
  
  // 设置默认请求头
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 如果有token，添加到请求头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // 发起请求
    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      headers,
    });
    
    // 处理响应
    if (response.statusCode === 200) {
      return response.data;
    } else {
      // 处理错误
      Taro.showToast({
        title: response.data.message || '请求失败',
        icon: 'none',
        duration: 2000,
      });
      throw new Error(response.data.message || '请求失败');
    }
  } catch (error) {
    // 处理网络错误
    Taro.showToast({
      title: '网络错误，请检查网络连接',
      icon: 'none',
      duration: 2000,
    });
    throw error;
  }
};

// 导出GET、POST等方法
export const get = (url, params) => {
  return request(url, {
    method: 'GET',
    data: params,
  });
};

export const post = (url, data) => {
  return request(url, {
    method: 'POST',
    data,
  });
};

export const put = (url, data) => {
  return request(url, {
    method: 'PUT',
    data,
  });
};

export const del = (url, params) => {
  return request(url, {
    method: 'DELETE',
    data: params,
  });
};

export default request;