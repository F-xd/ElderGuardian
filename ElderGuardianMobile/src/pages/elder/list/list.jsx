import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import { apiGetUserList } from '../../../services/userApi';
import Taro, { useReachBottom, usePullDownRefresh } from '@tarojs/taro';
import { SearchBar, Empty, Loading } from '@nutui/nutui-react-taro';
import './list.less';

const ElderList = () => {
  const [elderList, setElderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef(null);

  // 获取老人列表
  const fetchElderList = async (isLoadMore = false) => {
    console.log('fetchElderList called, isLoadMore:', isLoadMore);
    console.log('loadingMore:', loadingMore, 'hasMore:', hasMore);
    
    // 如果是加载更多，检查hasMore；如果是重新加载，不检查hasMore
    if (loadingMore || (isLoadMore && !hasMore)) return;
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const requestData = {
        condition:{
            role: 0, // 只获取老人用户 (ROLE.ELDER = 0)
        },
        pageNumber: isLoadMore ? pageNumber + 1 : 1,
        pageSize: pageSize
      };
      console.log('请求数据:', requestData);
      
      const response = await apiGetUserList(requestData);
      console.log('响应数据:', response);
      
      if (response.code === 200) {
        const newData = response.data.content || [];
        if (isLoadMore) {
          setElderList(prev => [...prev, ...newData]);
        } else {
          setElderList(newData);
        }
        setHasMore(newData.length === pageSize);
        setPageNumber(isLoadMore ? pageNumber + 1 : 1);
      }
    } catch (error) {
      console.error('获取老人列表失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchElderList();
  }, []);

  // 处理搜索
  useEffect(() => {
    if (searchValue) {
      const filtered = elderList.filter(elder => 
        (elder.userName || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (elder.name || '').toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(elderList);
    }
  }, [searchValue, elderList]);

  // 处理下拉刷新
  usePullDownRefresh(async () => {
    console.log('下拉刷新');
    // 重置状态
    setPageNumber(1);
    setHasMore(true);
    setElderList([]);
    // 重新获取数据
    await fetchElderList(false);
    // 停止下拉刷新
    Taro.stopPullDownRefresh();
  });

  // 处理上拉加载更多
  useReachBottom(() => {
    console.log('上拉加载更多');
    if (hasMore && !loadingMore) {
      fetchElderList(true);
    }
  });

  // 处理老人项点击
  const handleElderPress = (elder) => {
    Taro.navigateTo({
      url: `/pages/elder/detail/detail?id=${elder.userId || elder.id}`
    });
  };

  return (
    <View className="container">
      {/* 搜索栏 */}
      <View className="search-container">
        <SearchBar 
          value={searchValue}
          onChange={setSearchValue}
          placeholder="搜索老人姓名或手机号"
          className="search-bar"
        />
      </View>

      {/* 老人列表 */}
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
        ) : filteredList.length > 0 ? (
          <View>
            {filteredList.map((elder) => (
              <View 
                key={elder.userId || elder.id} 
                onClick={() => handleElderPress(elder)}
                className="elder-item"
              >
                <Image 
                  className="avatar"
                  src={elder.avatar ? `http://192.168.50.219:8080${elder.avatar}` : `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20person%20avatar%2C%20friendly%2C%20flat%20design&image_size=square`}
                  onError={(e) => {
                    e.target.src = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20person%20avatar%2C%20friendly%2C%20flat%20design&image_size=square`;
                  }}
                />
                <View className="elder-info">
                  <Text className="elder-name">{elder.userName || elder.name}</Text>
                  <Text className="elder-username">{elder.phone}</Text>
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
            {!hasMore && elderList.length > 0 && (
              <View className="no-more-container">
                <Text className="no-more-text">没有更多数据了</Text>
              </View>
            )}
          </View>
        ) : (
          <Empty description="暂无老人数据" />
        )}
      </ScrollView>
    </View>
  );
};

export default ElderList;
