import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { apiGetElderHealth } from '../../services/userApi';
import Taro from '@tarojs/taro';
import { Empty, Loading, SearchBar } from '@nutui/nutui-react-taro';
import './health.less';

const Health = () => {
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // 获取健康数据
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await apiGetElderHealth({ page: 1, size: 100 });
        if (response.code === 200) {
          setHealthData(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error('获取健康数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  // 处理搜索
  useEffect(() => {
    if (searchValue) {
      const filtered = healthData.filter(item => 
        item.elderName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(healthData);
    }
  }, [searchValue, healthData]);

  // 获取健康状态颜色
  const getHealthStatusColor = (status) => {
    if (status === 'NORMAL') {
      return '#26AE66';
    } else if (status === 'WARNING') {
      return '#FF9800';
    } else {
      return '#FF4757';
    }
  };

  // 获取健康状态文本
  const getHealthStatusText = (status) => {
    if (status === 'NORMAL') {
      return '正常';
    } else if (status === 'WARNING') {
      return '警告';
    } else {
      return '异常';
    }
  };

  // 处理健康数据点击
  const handleHealthPress = (item) => {
    Taro.showModal({
      title: '健康详情',
      content: `老人: ${item.elderName}\n心率: ${item.heartRate} bpm\n血压: ${item.bloodPressure}\n体温: ${item.temperature}°C\n状态: ${getHealthStatusText(item.status)}`,
      showCancel: false
    });
  };

  return (
    <View className="container">
      {/* 搜索栏 */}
      <View className="search-container">
        <SearchBar 
          value={searchValue}
          onChange={setSearchValue}
          placeholder="搜索老人姓名"
          className="search-bar"
        />
      </View>

      {/* 健康数据列表 */}
      <ScrollView className="list-container">
        {loading ? (
          <Loading className="loading" />
        ) : filteredData.length > 0 ? (
          <View>
            {filteredData.map((item, index) => (
              <View 
                key={index} 
                onClick={() => handleHealthPress(item)}
                className="health-item"
              >
                <View className="health-header">
                  <View className="health-avatar">
                    <Text className="health-avatar-text">{item.elderName.charAt(0)}</Text>
                  </View>
                  <View className="health-info">
                    <Text className="health-name">{item.elderName}</Text>
                    <Text className="health-time">{item.updateTime}</Text>
                  </View>
                  <View className="health-status-container">
                    <View 
                      className="health-status"
                      style={`background-color: ${getHealthStatusColor(item.status)}`}
                    >
                      <Text className="health-status-text">{getHealthStatusText(item.status)}</Text>
                    </View>
                  </View>
                </View>
                <View className="health-data">
                  <View className="data-item">
                    <Text className="data-label">心率</Text>
                    <Text className="data-value">{item.heartRate} bpm</Text>
                  </View>
                  <View className="data-item">
                    <Text className="data-label">血压</Text>
                    <Text className="data-value">{item.bloodPressure}</Text>
                  </View>
                  <View className="data-item">
                    <Text className="data-label">体温</Text>
                    <Text className="data-value">{item.temperature}°C</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Empty description="暂无健康数据" />
        )}
      </ScrollView>
    </View>
  );
};

export default Health;
