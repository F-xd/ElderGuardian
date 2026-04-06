import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Picker } from "@tarojs/components";
import { apiGetUserList, apiGetElderHealth } from "../../services/userApi";
import Taro from "@tarojs/taro";
import { Cell, Loading } from "@nutui/nutui-react-taro";
import "./index.less";

const DigitalHealth = () => {
  const [elderList, setElderList] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedElderIndex, setSelectedElderIndex] = useState(0);

  // 获取老人列表
  useEffect(() => {
    fetchElderList();
  }, []);

  // 获取老人列表
  const fetchElderList = async () => {
    try {
      const response = await apiGetUserList({
        condition: { role: 0 }, // 0 表示老人角色
        pageNumber: 1,
        pageSize: 100,
      });
      if (response.code === 200) {
        setElderList(response.data.content || []);
        // 默认选择第一个老人
        if (response.data.content && response.data.content.length > 0) {
          setSelectedElder(response.data.content[0]);
          setSelectedElderIndex(0);
          fetchElderHealth(response.data.content[0].userId);
        }
      }
    } catch (error) {
      console.error("获取老人列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取老人健康数据
  const fetchElderHealth = async (userId) => {
    if (!userId) return;

    setLoading(true);
    try {
      // 计算时间戳：一小时前和现在
      const now = new Date().getTime();
      const oneHourAgo = now - 60 * 60 * 1000;

      const response = await apiGetElderHealth({
        userId,
        minTime: oneHourAgo,
        maxTime: now,
      });
      if (response.code === 200) {
        setHealthData(response.data);
      }
    } catch (error) {
      console.error("获取老人健康数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理老人选择
  const handleElderSelect = (e) => {
    const index = e.detail.value;
    setSelectedElderIndex(index);

    const elder = elderList[index];
    if (elder) {
      setSelectedElder(elder);
      fetchElderHealth(elder.userId);
    }
  };

  // 构建Picker选项
  const getPickerOptions = () => {
    const options = [
      elderList.map((elder) => ({
        value: elder.userId,
        label: elder.userName,
      })),
    ];
    console.log("Picker options:", options);
    console.log("Elder list:", elderList);
    return options;
  };

  return (
    <ScrollView className="container">
      {/* 老人选择 */}
      <View className="select-container">
        <View className="picker-container">
          <Text className="picker-label">选择老人</Text>
          <Picker
            mode="selector"
            range={elderList.map((elder) => elder.userName)}
            value={selectedElderIndex}
            onChange={handleElderSelect}
            className="picker"
          >
            <View className="picker-display">
              <Text className="picker-value">
                {selectedElder?.userName || "请选择老人"}
              </Text>
            </View>
          </Picker>
        </View>
      </View>

      {loading ? (
        <View className="loading-container">
          <Loading size="large" />
          <Text className="loading-text">加载中...</Text>
        </View>
      ) : healthData ? (
        <View className="content-container">
          {/* 老人信息卡片 */}
          <View className="info-card">
            <View className="card-header">
              <Text className="card-title">老人信息</Text>
            </View>
            <View className="info-content">
              <View className="avatar-section">
                <Image
                  className="avatar"
                  src={
                    healthData.avatar
                      ? `http://192.168.50.219:8080${healthData.avatar}`
                      : `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20person%20avatar%2C%20friendly%2C%20flat%20design&image_size=square`
                  }
                  onError={(e) => {
                    e.target.src = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20person%20avatar%2C%20friendly%2C%20flat%20design&image_size=square`;
                  }}
                />
                <View className="user-info">
                  <Text className="user-name">{healthData.userName}</Text>
                  <Text className="user-detail">
                    性别: {healthData.gender?.genderName || "-"}
                  </Text>
                  <Text className="user-detail">
                    生日: {healthData.birthday || "-"}
                  </Text>
                  <Text className="user-detail">
                    电话: {healthData.phone || "-"}
                  </Text>
                  <Text className="user-detail">
                    房间: {healthData.room?.roomNumber || "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 健康数据卡片 */}
          <View className="health-card">
            <View className="card-header">
              <Text className="card-title">健康监测</Text>
            </View>
            <View className="health-content">
              {healthData.healthDevice ? (
                <View className="health-items">
                  <View className="health-item">
                    <View className="health-icon">
                      <Text className="icon-text">❤️</Text>
                    </View>
                    <View className="health-info">
                      <Text className="health-label">心率</Text>
                      <Text className="health-value">
                        {healthData.healthDevice.heartRate} BPM
                      </Text>
                    </View>
                  </View>
                  <View className="health-item">
                    <View className="health-icon">
                      <Text className="icon-text">🩸</Text>
                    </View>
                    <View className="health-info">
                      <Text className="health-label">血氧</Text>
                      <Text className="health-value">
                        {healthData.healthDevice.spo2}%
                      </Text>
                    </View>
                  </View>
                  <View className="health-item">
                    <View className="health-icon">
                      <Text className="icon-text">⚠️</Text>
                    </View>
                    <View className="health-info">
                      <Text className="health-label">状态</Text>
                      <Text
                        className={`health-value ${healthData.healthDevice.isFallDown ? "status-danger" : "status-normal"}`}
                      >
                        {healthData.healthDevice.isFallDown
                          ? "摔倒警报"
                          : "状态正常"}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text className="no-data">暂无健康数据</Text>
              )}
            </View>
          </View>

          {/* 房间信息卡片 */}
          <View className="room-card">
            <View className="card-header">
              <Text className="card-title">房间信息</Text>
            </View>
            <View className="room-content">
              {healthData.roomDevice ? (
                <View className="room-items">
                  <View className="room-item">
                    <View className="room-icon">
                      <Text className="icon-text">🌡️</Text>
                    </View>
                    <View className="room-info">
                      <Text className="room-label">温度</Text>
                      <Text className="room-value">
                        {healthData.roomDevice.temperature} °C
                      </Text>
                    </View>
                  </View>
                  <View className="room-item">
                    <View className="room-icon">
                      <Text className="icon-text">💧</Text>
                    </View>
                    <View className="room-info">
                      <Text className="room-label">湿度</Text>
                      <Text className="room-value">
                        {healthData.roomDevice.humidity}%
                      </Text>
                    </View>
                  </View>
                  <View className="room-item">
                    <View className="room-icon">
                      <Text className="icon-text">💨</Text>
                    </View>
                    <View className="room-info">
                      <Text className="room-label">气体浓度</Text>
                      <Text className="room-value">
                        {healthData.roomDevice.gasConcentration} ppm
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text className="no-data">暂无房间数据</Text>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View className="no-data-container">
          <Text className="no-data-text">请选择老人查看健康数据</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default DigitalHealth;
