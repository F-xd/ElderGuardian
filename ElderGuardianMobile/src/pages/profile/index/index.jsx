import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { apiGetUser } from '../../../services/userApi';
import Taro from '@tarojs/taro';
import { Button } from '@nutui/nutui-react-taro';
import './index.less';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 功能列表
  const menuItems = [
    {
      id: 'changePassword',
      title: '修改密码',
      icon: '🔒',
      url: '/pages/profile/changePassword/changePassword'
    },
    {
      id: 'about',
      title: '关于我们',
      icon: 'ℹ️',
      url: ''
    },
    {
      id: 'feedback',
      title: '意见反馈',
      icon: '💬',
      url: ''
    },
    {
      id: 'settings',
      title: '设置',
      icon: '⚙️',
      url: ''
    }
  ];

  // 获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 获取用户信息
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await apiGetUser();
      if (response.code === 200) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理菜单点击
  const handleMenuPress = (url) => {
    if (url) {
      Taro.navigateTo({
        url
      });
    } else {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          Taro.removeStorageSync('token');
          Taro.removeStorageSync('user');
          // 跳转到登录页
          Taro.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  };

  return (
    <ScrollView className="container">
      {/* 用户信息 */}
      <View className="user-card">
        <View className="user-info">
          <Image 
            className="avatar"
            src={userInfo?.avatar ? `http://192.168.50.219:8080${userInfo.avatar}` : "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2C%20professional%2C%20flat%20design&image_size=square"} 
            onError={(e) => {
              e.target.src = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2C%20professional%2C%20flat%20design&image_size=square";
            }}
          />
          <View className="user-text">
            <Text className="user-name">{userInfo?.userName || '未知用户'}</Text>
            <Text className="user-role">
              {userInfo?.role?.name || userInfo?.role?.roleName || '未知角色'}
            </Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="menu-card">
        {menuItems.map((item) => (
          <View 
            key={item.id} 
            onClick={() => handleMenuPress(item.url)}
            className="menu-item"
          >
            <View className="menu-item-content">
              <Text className="menu-icon">{item.icon}</Text>
              <Text className="menu-title">{item.title}</Text>
            </View>
            <Text className="chevron-right">›</Text>
          </View>
        ))}
      </View>

      {/* 退出登录按钮 */}
      <View className="logout-container">
        <Button 
          type="danger" 
          block 
          className="logout-button"
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </View>

      {/* 版本信息 */}
      <View className="version-container">
        <Text className="version-text">ElderGuardian v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default Profile;
