import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { apiGetAlarmById, apiHandleAlarm } from '../../../services/alarmApi';
import Taro from '@tarojs/taro';
import { Loading, Button } from '@nutui/nutui-react-taro';
import './detail.less';

const AlarmDetail = () => {
  const [alarmInfo, setAlarmInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handling, setHandling] = useState(false);

  // 格式化时间
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 获取告警详细信息
  useEffect(() => {
    const fetchAlarmDetail = async () => {
      const id = Taro.getCurrentInstance().router.params.id;
      if (!id) {
        Taro.showToast({
          title: '参数错误',
          icon: 'none'
        });
        return;
      }

      try {
        const response = await apiGetAlarmById(id);
        if (response.code === 200) {
          // 从返回的列表中获取第一个元素
          const alarmList = response.data.content || [];
          if (alarmList.length > 0) {
            setAlarmInfo(alarmList[0]);
          } else {
            console.error('未找到告警信息');
          }
        }
      } catch (error) {
        console.error('获取告警信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarmDetail();
  }, []);

  // 处理告警
  const handleAlarm = async () => {
    if (!alarmInfo || alarmInfo.alarmStatus?.name === '已处理') {
      return;
    }

    setHandling(true);
    try {
      const response = await apiHandleAlarm(alarmInfo.id);
      if (response.code === 200) {
        Taro.showToast({
          title: '处理成功',
          icon: 'success'
        });
        setAlarmInfo({ 
          ...alarmInfo, 
          alarmStatus: { ...alarmInfo.alarmStatus, name: '已处理' }
        });
      } else {
        Taro.showToast({
          title: response.message || '处理失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('处理告警失败:', error);
      Taro.showToast({
        title: '处理失败，请重试',
        icon: 'none'
      });
    } finally {
      setHandling(false);
    }
  };

  // 获取告警状态样式
  const getAlarmStatusStyle = (status) => {
    if (status === '未处理') {
      return 'status-unhandled';
    } else {
      return 'status-handled';
    }
  };

  // 获取告警状态文本
  const getAlarmStatusText = (status) => {
    return status || '未知状态';
  };

  if (loading) {
    return (
      <View className="container">
        <Loading className="loading" />
      </View>
    );
  }

  if (!alarmInfo) {
    return (
      <View className="container">
        <Text className="error-text">未找到告警信息</Text>
      </View>
    );
  }

  return (
    <ScrollView className="container">
      {/* 头部信息 */}
      <View className="header">
        <View className="alarm-icon">
          <Text className="alarm-icon-text">⚠️</Text>
        </View>
        <Text className="alarm-type">{alarmInfo.alarmType?.name || '未知告警'}</Text>
        <View className={`alarm-status ${getAlarmStatusStyle(alarmInfo.alarmStatus?.name)}`}>
          <Text className="alarm-status-text">{getAlarmStatusText(alarmInfo.alarmStatus?.name)}</Text>
        </View>
      </View>

      {/* 告警详情 */}
      <View className="info-card">
        <Text className="card-title">告警详情</Text>
        <View className="info-item">
          <Text className="info-label">告警类型</Text>
          <Text className="info-value">{alarmInfo.alarmType?.name || '未知告警'}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">告警事件</Text>
          <Text className="info-value">{alarmInfo.alarmEvent?.name || '未知事件'}</Text>
        </View>
        <View className="info-item">
          <Text className="info-label">告警时间</Text>
          <Text className="info-value">{formatTime(alarmInfo.alarmTime)}</Text>
        </View>
        {alarmInfo.handleTime && (
          <View className="info-item">
            <Text className="info-label">处理时间</Text>
            <Text className="info-value">{formatTime(alarmInfo.handleTime)}</Text>
          </View>
        )}
        {alarmInfo.handleReason && (
          <View className="info-item">
            <Text className="info-label">处理原因</Text>
            <Text className="info-value">{alarmInfo.handleReason}</Text>
          </View>
        )}
        {alarmInfo.handleUser && (
          <View className="info-item">
            <Text className="info-label">处理人</Text>
            <Text className="info-value">{alarmInfo.handleUser.userName}</Text>
          </View>
        )}
      </View>

      {/* 相关老人信息 */}
      {alarmInfo.elder && (
        <View className="info-card">
          <Text className="card-title">相关老人</Text>
          <View className="info-item">
            <Text className="info-label">老人姓名</Text>
            <Text className="info-value">{alarmInfo.elder.userName}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">手机号</Text>
            <Text className="info-value">{alarmInfo.elder.phone}</Text>
          </View>
        </View>
      )}

      {/* 健康数据 */}
      {alarmInfo.healthData && (
        <View className="info-card">
          <Text className="card-title">健康数据</Text>
          <View className="info-item">
            <Text className="info-label">设备名称</Text>
            <Text className="info-value">{alarmInfo.healthData.deviceName}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">心率</Text>
            <Text className="info-value">{alarmInfo.healthData.heartRate} BPM</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">血氧</Text>
            <Text className="info-value">{alarmInfo.healthData.spo2}%</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">是否跌倒</Text>
            <Text className="info-value">{alarmInfo.healthData.isFallDown ? '是' : '否'}</Text>
          </View>
        </View>
      )}

      {/* 环境数据 */}
      {alarmInfo.environmentData && (
        <View className="info-card">
          <Text className="card-title">环境数据</Text>
          <View className="info-item">
            <Text className="info-label">设备名称</Text>
            <Text className="info-value">{alarmInfo.environmentData.deviceName}</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">温度</Text>
            <Text className="info-value">{alarmInfo.environmentData.temperature} °C</Text>
          </View>
          <View className="info-item">
            <Text className="info-label">湿度</Text>
            <Text className="info-value">{alarmInfo.environmentData.humidity}%</Text>
          </View>
          {alarmInfo.environmentData.gasConcentration && (
            <View className="info-item">
              <Text className="info-label">气体浓度</Text>
              <Text className="info-value">{alarmInfo.environmentData.gasConcentration} ppm</Text>
            </View>
          )}
        </View>
      )}

      {/* 处理按钮 */}
      {alarmInfo.alarmStatus?.name === '未处理' && (
        <View className="button-container">
          <Button 
            type="primary" 
            block 
            className="handle-button"
            loading={handling}
            onClick={handleAlarm}
          >
            标记为已处理
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default AlarmDetail;
