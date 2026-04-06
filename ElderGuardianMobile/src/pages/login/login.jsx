import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { apiLogin, apiGetUser } from '../../services/userApi';
import Taro from '@tarojs/taro';
import { Button } from '@nutui/nutui-react-taro';
import './login.less';

const Login = () => {
  const [loading, setLoading] = useState(false);
  
  // 登录表单
  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: ''
  });

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.phone || !loginForm.password) {
      Taro.showToast({
        title: '请填写手机号和密码',
        icon: 'none'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiLogin(loginForm);
      if (response.code === 200) {
        // 保存token
        Taro.setStorageSync('token', response.data.token);
        console.log('保存的token:', response.data.token);
        console.log('从storage获取的token:', Taro.getStorageSync('token'));
        
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 延迟跳转到首页，确保token已保存
        setTimeout(async () => {
          // 获取用户信息
          const userRes = await apiGetUser();
          if (userRes.code === 200) {
            Taro.setStorageSync('user', userRes.data);
            console.log('获取的用户信息:', userRes.data);
          }
          
          // 跳转到首页
          Taro.switchTab({
            url: '/pages/index/index'
          });
        }, 1000);
      } else {
        Taro.showToast({
          title: response.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="container">
      {/* Logo */}
      <View className="logo-container">
        <Text className="app-name">养老院老人健康监测系统</Text>
      </View>

      {/* 登录表单 */}
      <View className="form-container">
        <View className="input-item">
          <Text className="input-label">手机号</Text>
          <Input 
            className="input-field"
            placeholder="请输入手机号"
            value={loginForm.phone}
            onInput={(e) => setLoginForm({ ...loginForm, phone: e.detail.value })}
          />
        </View>
        <View className="input-item">
          <Text className="input-label">密码</Text>
          <Input 
            className="input-field"
            placeholder="请输入密码"
            password
            value={loginForm.password}
            onInput={(e) => setLoginForm({ ...loginForm, password: e.detail.value })}
          />
        </View>
        <Button 
          type="primary" 
          block 
          className="submit-button"
          loading={loading}
          onClick={handleLogin}
        >
          登录
        </Button>
      </View>
    </View>
  );
};

export default Login;
