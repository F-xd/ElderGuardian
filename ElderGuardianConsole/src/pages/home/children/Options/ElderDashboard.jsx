import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button } from "antd";
import {
  AlertFilled,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { getAlarmList } from "../../../../services/alarmApi";
import { apiGetElderHealth } from "../../../../services/userApi";

const ElderDashboard = () => {
  const [healthData, setHealthData] = useState([]);
  const [environmentData, setEnvironmentData] = useState([]);
  const [alarmHistory, setAlarmHistory] = useState([]);

  useEffect(() => {
    loadElderData();
  }, []);

  const loadElderData = async () => {
    try {
      const alarmRes = await getAlarmList({ pageNumber: 1, pageSize: 10 });
      if (alarmRes.code === 200) {
        setAlarmHistory((alarmRes.data.content || []).slice(0, 5));
      }

      const mockHealthData = [
        { type: "心率", value: "72", unit: "bpm", status: "normal", icon: <CheckCircleOutlined /> },
        { type: "血压", value: "120/80", unit: "mmHg", status: "normal", icon: <CheckCircleOutlined /> },
        { type: "体温", value: "36.5", unit: "°C", status: "normal", icon: <AlertOutlined /> },
        { type: "血氧", value: "98", unit: "%", status: "normal", icon: <AlertFilled /> },
        { type: "呼吸", value: "18", unit: "次/分", status: "normal", icon: <CloseCircleOutlined /> },
        { type: "血糖", value: "5.2", unit: "mmol/L", status: "normal", icon: <AlertFilled /> },
      ];
      setHealthData(mockHealthData);

      const mockEnvData = [
        { type: "室内温度", value: "24", unit: "°C", status: "normal" },
        { type: "室内湿度", value: "55", unit: "%", status: "normal" },
        { type: "PM2.5", value: "23", unit: "μg/m³", status: "normal" },
        { type: "二氧化碳", value: "450", unit: "ppm", status: "normal" },
      ];
      setEnvironmentData(mockEnvData);
    } catch (error) {
      console.error("加载老人数据失败:", error);
    }
  };

  const getHealthStatusTag = (status) => {
    const colors = { normal: "green", warning: "orange", urgent: "red" };
    const labels = { normal: "正常", warning: "关注", urgent: "紧急" };
    return <Tag color={colors[status]}>{labels[status]}</Tag>;
  };

  const alarmColumns = [
    { 
      title: "告警类型", 
      dataIndex: "alarmType", 
      key: "alarmType",
      render: (alarmType) => alarmType?.name || alarmType
    },
    { 
      title: "告警事件", 
      dataIndex: "alarmEvent", 
      key: "alarmEvent",
      render: (alarmEvent) => alarmEvent?.name || alarmEvent
    },
    {
      title: "状态",
      dataIndex: "alarmStatus",
      key: "alarmStatus",
      render: (status) => {
        const statusId = status?.id ?? status;
        return statusId === 0 ? (
          <Tag color="red">待处理</Tag>
        ) : (
          <Tag color="green">已处理</Tag>
        );
      },
    },
    { 
      title: "时间", 
      dataIndex: "alarmTime", 
      key: "alarmTime",
      render: (timestamp) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleString();
      }
    },
  ];

  return (
    <div className="dashboard">
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserOutlined className="text-3xl text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">欢迎回家，张奶奶</h2>
              <p className="text-gray-500">
                <AlertFilled className="mr-1" />
                今天是 2024年1月15日 星期一
              </p>
            </div>
          </div>
          <Button type="primary" icon={<PhoneOutlined />}>
            呼叫护理人员
          </Button>
        </div>
      </Card>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card title="我的健康数据" bordered={false}>
            <div className="grid grid-cols-3 gap-4">
              {healthData.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-gray-400 text-lg mb-1">{item.icon}</div>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm text-gray-500">{item.unit}</div>
                  <div className="mt-2">{getHealthStatusTag(item.status)}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="房间环境" bordered={false}>
            <div className="grid grid-cols-2 gap-4">
              {environmentData.map((item, index) => (
                <Card key={index} hoverable>
                  <div className="text-sm text-gray-500">{item.type}</div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
                  </div>
                  <div className="mt-2">{getHealthStatusTag(item.status)}</div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="告警历史" bordered={false}>
            <Table
              columns={alarmColumns}
              dataSource={alarmHistory}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ElderDashboard;