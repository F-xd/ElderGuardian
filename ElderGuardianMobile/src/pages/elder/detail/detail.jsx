import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { apiGetUserListByIds } from '../../../services/userApi';
import Taro from '@tarojs/taro';
import { Loading } from '@nutui/nutui-react-taro';
import './detail.less';

const ElderDetail = () => {
  const [elderInfo, setElderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取老人详细信息
  useEffect(() => {
    const fetchElderDetail = async () => {
      const id = Taro.getCurrentInstance().router.params.id;
      if (!id) {
        Taro.showToast({
          title: '参数错误',
          icon: 'none'
        });
        return;
      }

      try {
        const response = await apiGetUserListByIds([parseInt(id)]);
        if (response.code === 200 && response.data && response.data.length > 0) {
          setElderInfo(response.data[0]);
        }
      } catch (error) {
        console.error('获取老人信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElderDetail();
  }, []);

  if (loading) {
    return (
      <View className="container">
        <Loading className="loading" />
      </View>
    );
  }

  if (!elderInfo) {
    return (
      <View className="container">
        <Text className="error-text">未找到老人信息</Text>
      </View>
    );
  }

  return (
    <ScrollView className="container">
      {/* 头部信息 */}
      <View className="header">
        <Image 
          className="avatar"
          src={elderInfo.avatar ? `http://192.168.50.219:8080${elderInfo.avatar}` : "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20person%20avatar%2C%20friendly%2C%20flat%20design&image_size=square"}
        />
        <Text className="name">{elderInfo.userName}</Text>
        <Text className="username">@{elderInfo.phone}</Text>
      </View>

      {/* 基本信息 */}
      <View className="info-card">
        <Text className="card-title">基本信息</Text>
        <View className="info-item">
          <Text className="info-label">用户名</Text>
          <Text className="info-value">{elderInfo.userName}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">手机号</Text>
          <Text className="info-value">{elderInfo.phone}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">性别</Text>
          <Text className="info-value">{elderInfo.gender?.name || elderInfo.gender?.genderName || '未知'}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">生日</Text>
          <Text className="info-value">{elderInfo.birthday || '未设置'}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">角色</Text>
          <Text className="info-value">{elderInfo.role?.name || elderInfo.role?.roleName || '未知'}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">房间</Text>
          <Text className="info-value">{elderInfo.room?.roomNumber || '未分配'}</Text>
        </View>
      </View>

      {/* 健康信息 */}
      <View className="info-card">
        <Text className="card-title">健康信息</Text>
        <View className="info-item">
          <Text className="info-label">健康设备</Text>
          <Text className="info-value">{elderInfo.healthDevice?.deviceName || '未绑定'}</Text>
        </View>
      </View>

      {/* 联系信息 */}
      <View className="info-card">
        <Text className="card-title">联系信息</Text>
        <View className="info-item">
          <Text className="info-label">联系电话</Text>
          <Text className="info-value">{elderInfo.phone || '未设置'}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">家属数量</Text>
          <Text className="info-value">{elderInfo.familyIds?.length || 0} 人</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">护理人员数量</Text>
          <Text className="info-value">{elderInfo.caregiverIds?.length || 0} 人</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ElderDetail;
