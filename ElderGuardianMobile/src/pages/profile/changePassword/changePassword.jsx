import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { apiChangePassword } from '../../../services/userApi';
import Taro from '@tarojs/taro';
import { Button } from '@nutui/nutui-react-taro';
import './changePassword.less';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 处理修改密码
  const handleChangePassword = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      Taro.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }

    if (form.newPassword.length < 6) {
      Taro.showToast({
        title: '密码长度至少6位',
        icon: 'none'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiChangePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      
      if (response.code === 200) {
        Taro.showToast({
          title: '修改成功',
          icon: 'success'
        });
        
        // 清空表单
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // 返回上一页
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      } else {
        Taro.showToast({
          title: response.message || '修改失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      Taro.showToast({
        title: '修改失败，请重试',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="container">
      {/* 表单 */}
      <View className="form-container">
        <View className="input-item">
          <Text className="input-label">旧密码</Text>
          <Input 
            className="input-field"
            placeholder="请输入旧密码"
            password
            value={form.oldPassword}
            onInput={(e) => setForm({ ...form, oldPassword: e.detail.value })}
          />
        </View>
        <View className="input-item">
          <Text className="input-label">新密码</Text>
          <Input 
            className="input-field"
            placeholder="请输入新密码"
            password
            value={form.newPassword}
            onInput={(e) => setForm({ ...form, newPassword: e.detail.value })}
          />
        </View>
        <View className="input-item">
          <Text className="input-label">确认密码</Text>
          <Input 
            className="input-field"
            placeholder="请再次输入新密码"
            password
            value={form.confirmPassword}
            onInput={(e) => setForm({ ...form, confirmPassword: e.detail.value })}
          />
        </View>
      </View>

      {/* 提示信息 */}
      <View className="tips-container">
        <Text className="tips-text">密码长度至少6位，建议使用字母、数字和符号的组合</Text>
      </View>

      {/* 提交按钮 */}
      <View className="button-container">
        <Button 
          type="primary" 
          block 
          className="submit-button"
          loading={loading}
          onClick={handleChangePassword}
        >
          确认修改
        </Button>
      </View>
    </View>
  );
};

export default ChangePassword;
