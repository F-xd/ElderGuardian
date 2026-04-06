import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { apiGetUnhandledAlarmList } from "../../services/alarmApi";
import Taro from "@tarojs/taro";
import { Badge } from "@nutui/nutui-react-taro";
import "./index.less";

const Index = () => {
  const [unhandledAlarms, setUnhandledAlarms] = useState(0);
  const [loading, setLoading] = useState(true);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取未处理告警数
        const alarmResponse = await apiGetUnhandledAlarmList();
        if (alarmResponse.code === 200) {
          setUnhandledAlarms(alarmResponse.data.length);
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView className="container">
      {/* 头部信息 */}
      <View className="header">
        <View className="user-info">
          <Image
            className="user-avatar"
            src={
              Taro.getStorageSync("user")?.avatar
                ? `http://192.168.50.219:8080${Taro.getStorageSync("user").avatar}`
                : "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2C%20professional%2C%20flat%20design&image_size=square"
            }
            onError={(e) => {
              e.target.src =
                "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2C%20professional%2C%20flat%20design&image_size=square";
            }}
          />
          <View className="user-text">
            <Text className="welcome-text">欢迎回来</Text>
            <Text className="user-name">
              {Taro.getStorageSync("user")?.userName || "管理员"}
            </Text>
          </View>
        </View>
      </View>

      {/* 告警信息卡片 */}
      <View className="alarm-card">
        <View className="alarm-header">
          <Text className="alarm-title">告警中心</Text>
          <View
            onClick={() => Taro.switchTab({ url: "/pages/alarm/list/list" })}
          >
            <Text className="view-more-text">查看更多</Text>
          </View>
        </View>
        <View className="alarm-content">
          <View className="alarm-item">
            <Text className="alarm-label">未处理告警</Text>
            <Badge value={unhandledAlarms} max={99} className="alarm-badge">
              <Text className="alarm-value">{unhandledAlarms}</Text>
            </Badge>
          </View>
          {unhandledAlarms > 0 && (
            <Text className="alarm-hint">
              有{unhandledAlarms}条告警需要处理
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
