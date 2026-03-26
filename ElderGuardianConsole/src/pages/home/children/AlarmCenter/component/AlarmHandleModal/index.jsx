import { Form, Modal, Input, Space, Descriptions, Avatar } from "antd";
import React, { useEffect } from "react";
import { AlarmTypeTag } from "@/component/AlarmTypeSelect";
import { AlarmEventTag } from "@/component/AlarmEventSelect";
import { AlarmStatusTag } from "@/component/AlarmStatusSelect";
import { BASE_URL } from "@/utils/request";
import { handleAlarm } from "@/services/alarmApi";

const { TextArea } = Input;

export default function AlarmHandleModal(props) {
  const { visible, onCancel, onOk, alarm, isEdit } = props;
  const [form] = Form.useForm();

  // 当alarm变化时，重置表单
  useEffect(() => {
    if (alarm) {
      form.setFieldsValue({
        handleReason: alarm.handleReason || "",
      });
    }
  }, [alarm, form]);

  // 处理确定按钮点击
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await handleAlarm({
        id: alarm.id,
        ...values,
      });
      onOk();
      onCancel();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      title={isEdit ? "处理警报" : "查看警报"}
      width={800}
      {...(isEdit ? {} : { footer: null })}
    >
      {alarm && (
        <Descriptions bordered column={2}>
          {/* 基本信息 */}
          <Descriptions.Item label="警报类型">
            <AlarmTypeTag alarmType={alarm.alarmType} />
          </Descriptions.Item>
          <Descriptions.Item label="警报事件">
            <AlarmEventTag alarmEvent={alarm.alarmEvent} />
          </Descriptions.Item>
          <Descriptions.Item label="警报状态">
            <AlarmStatusTag alarmStatus={alarm.alarmStatus} />
          </Descriptions.Item>
          <Descriptions.Item label="警报时间">
            {alarm.alarmTime ? new Date(alarm.alarmTime).toLocaleString() : "-"}
          </Descriptions.Item>

          {/* 房间信息 */}
          {alarm.room && (
            <>
              <Descriptions.Item label="房间号">
                {alarm.room.roomNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="当前人数">
                {alarm.room.currentCount || 0}
              </Descriptions.Item>
              <Descriptions.Item label="最大容量">
                {alarm.room.maxCapacity || 0}
              </Descriptions.Item>
            </>
          )}

          {/* 老人信息 */}
          {alarm.elder && (
            <>
              <Descriptions.Item label="老人姓名">
                <Space>
                  {alarm.elder.avatar ? (
                    <Avatar src={BASE_URL + alarm.elder.avatar} size={40} />
                  ) : (
                    <Avatar size={40}>
                      {alarm.elder.userName?.charAt(0) || "老"}
                    </Avatar>
                  )}
                  {alarm.elder.userName || "-"}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                {alarm.elder.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="性别">
                {alarm.elder.gender?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="生日">
                {alarm.elder.birthday || "-"}
              </Descriptions.Item>
            </>
          )}

          {/* 环境数据 */}
          {alarm.environmentData && (
            <>
              <Descriptions.Item label="设备名称">
                {alarm.environmentData.deviceName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="温度">
                {alarm.environmentData.temperature || 0}°C
              </Descriptions.Item>
              <Descriptions.Item label="湿度">
                {alarm.environmentData.humidity || 0}%
              </Descriptions.Item>
              <Descriptions.Item label="气体浓度">
                {alarm.environmentData.gasConcentration || 0}
              </Descriptions.Item>
            </>
          )}

          {/* 健康数据 */}
          {alarm.healthData && (
            <>
              <Descriptions.Item label="设备名称">
                {alarm.healthData.deviceName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="心率">
                {alarm.healthData.heartRate || 0}
              </Descriptions.Item>
              <Descriptions.Item label="血氧">
                {alarm.healthData.spo2 || 0}%
              </Descriptions.Item>
              <Descriptions.Item label="是否跌倒">
                {alarm.healthData.isFallDown ? "是" : "否"}
              </Descriptions.Item>
            </>
          )}
          {/* 处理信息 */}
          <Descriptions.Item label="处理人" span="filled">
            <Space>
              {alarm.handleUser?.avatar ? (
                <Avatar src={BASE_URL + alarm.handleUser.avatar} size={40} />
              ) : (
                <Avatar size={40}>
                  {alarm.handleUser?.userName?.charAt(0) || "待处理"}
                </Avatar>
              )}
              {alarm.handleUser?.userName || "-"}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="处理时间" span="filled">
            {alarm.handleTime
              ? new Date(alarm.handleTime).toLocaleString()
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="处理原因/措施" span="filled">
            <Form form={form} disabled={!isEdit} layout="vertical">
              <Form.Item
                name="handleReason"
                rules={[{ required: isEdit, message: "请输入处理原因" }]}
              >
                <TextArea
                  rows={4}
                  placeholder={isEdit ? "请输入处理原因或措施" : "暂无处理记录"}
                />
              </Form.Item>
            </Form>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
