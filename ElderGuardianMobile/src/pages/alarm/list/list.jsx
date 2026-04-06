import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { apiGetAlarmList, apiGetUnhandledAlarmList } from '../../../services/alarmApi';
import Taro, { useReachBottom, usePullDownRefresh } from '@tarojs/taro';
import { Empty, Loading, Switch } from '@nutui/nutui-react-taro';
import './list.less';

const AlarmList = () => {
  const [alarmList, setAlarmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showUnhandled, setShowUnhandled] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef(null);

  // 获取告警列表
  useEffect(() => {
    // 重置状态
    setPageNumber(1);
    setHasMore(true);
    setAlarmList([]);
    fetchAlarmList(false);
  }, [showUnhandled]);

  // 获取告警列表
  const fetchAlarmList = async (isLoadMore = false) => {
    console.log('fetchAlarmList called, isLoadMore:', isLoadMore);
    
    // 如果是加载更多，检查hasMore；如果是重新加载，不检查hasMore
    if (loadingMore || (isLoadMore && !hasMore)) return;
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      if (showUnhandled) {
        // 获取未处理告警（暂时不需要分页）
        const response = await apiGetUnhandledAlarmList();
        if (response.code === 200) {
          setAlarmList(response.data || []);
          setHasMore(false); // 未处理告警不需要分页
        }
      } else {
        // 获取所有告警（支持分页）
        const response = await apiGetAlarmList({
          pageNumber: isLoadMore ? pageNumber + 1 : 1,
          pageSize: pageSize
        });
        if (response.code === 200) {
          const newData = response.data.content || [];
          if (isLoadMore) {
            setAlarmList(prev => [...prev, ...newData]);
          } else {
            setAlarmList(newData);
          }
          setHasMore(newData.length === pageSize);
          setPageNumber(isLoadMore ? pageNumber + 1 : 1);
        }
      }
    } catch (error) {
      console.error('获取告警列表失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 处理下拉刷新
  usePullDownRefresh(async () => {
    console.log('下拉刷新');
    // 重置状态
    setPageNumber(1);
    setHasMore(true);
    setAlarmList([]);
    // 重新获取数据
    await fetchAlarmList(false);
    // 停止下拉刷新
    Taro.stopPullDownRefresh();
  });

  // 处理上拉加载更多
  useReachBottom(() => {
    console.log('上拉加载更多');
    // 只有在显示所有告警时才加载更多
    if (!showUnhandled && hasMore && !loadingMore) {
      fetchAlarmList(true);
    }
  });

  // 处理告警项点击
  const handleAlarmPress = (alarm) => {
    Taro.navigateTo({
      url: `/pages/alarm/detail/detail?id=${alarm.id}`
    });
  };

  // 处理开关切换
  const handleSwitchChange = (value) => {
    setShowUnhandled(value);
  };

  // 获取告警状态样式
  const getAlarmStatusStyle = (status) => {
    if (status === '未处理') {
      return 'alarm-status-unhandled';
    } else {
      return 'alarm-status-handled';
    }
  };

  // 获取告警状态文本
  const getAlarmStatusText = (status) => {
    return status || '未知状态';
  };

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

  return (
    <View className="container">
      {/* 过滤开关 */}
      <View className="filter-container">
        <Text className="filter-text">只显示未处理告警</Text>
        <Switch 
          checked={showUnhandled} 
          onChange={handleSwitchChange} 
        />
      </View>

      {/* 告警列表 */}
      <ScrollView 
        className="list-container"
        ref={scrollViewRef}
        scrollEventThrottle={50}
      >
        {loading ? (
          <View className="loading-container">
            <Loading size="large" />
            <Text className="loading-text">加载中...</Text>
          </View>
        ) : alarmList.length > 0 ? (
          <View>
            {alarmList.map((alarm) => (
              <View 
                key={alarm.id} 
                onClick={() => handleAlarmPress(alarm)}
                className="alarm-item"
              >
                <View className="alarm-icon">
                  <Text className="alarm-icon-text">⚠️</Text>
                </View>
                <View className="alarm-content">
                  <View className="cell-title">
                    <Text className="alarm-title">{alarm.alarmType?.name || '未知告警'}</Text>
                    <Text className="alarm-time">{formatTime(alarm.alarmTime)}</Text>
                  </View>
                  <View className="cell-desc">
                    <Text className="alarm-description">
                      {alarm.alarmEvent?.name || '未知事件'}
                      {alarm.elder ? ` - ${alarm.elder.userName}` : ''}
                    </Text>
                    <View className={`alarm-status ${getAlarmStatusStyle(alarm.alarmStatus?.name)}`}>
                      <Text className="alarm-status-text">{getAlarmStatusText(alarm.alarmStatus?.name)}</Text>
                    </View>
                  </View>
                </View>
                <Text className="chevron-right">›</Text>
              </View>
            ))}
            {/* 加载更多 */}
            {loadingMore && (
              <View className="loading-more-container">
                <Loading size="small" />
                <Text className="loading-more-text">加载更多...</Text>
              </View>
            )}
            {/* 没有更多数据 */}
            {!hasMore && !showUnhandled && alarmList.length > 0 && (
              <View className="no-more-container">
                <Text className="no-more-text">没有更多数据了</Text>
              </View>
            )}
          </View>
        ) : (
          <Empty description={showUnhandled ? "暂无未处理告警" : "暂无告警记录"} className="empty" />
        )}
      </ScrollView>
    </View>
  );
};

export default AlarmList;
