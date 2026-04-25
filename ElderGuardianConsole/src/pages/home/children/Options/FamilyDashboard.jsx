import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Avatar, Button } from "antd";
import {
  AlertFilled,
  AlertOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getAlarmList } from "../../../../services/alarmApi";
import { apiGetElderHealth } from "../../../../services/userApi";

const FamilyDashboard = () => {
  const [boundElders, setBoundElders] = useState([]);
  const [alarmList, setAlarmList] = useState([]);
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      const alarmRes = await getAlarmList({ pageNumber: 1, pageSize: 10 });
      if (alarmRes.code === 200) {
        setAlarmList((alarmRes.data.content || []).slice(0, 5));
      }

      const mockElders = [
        {
          userId: 1,
          userName: "张奶奶",
          age: 78,
          roomNumber: "A101",
          healthStatus: "normal",
          lastVisit: "2024-01-15",
        },
        {
          userId: 2,
          userName: "李爷爷",
          age: 82,
          roomNumber: "B203",
          healthStatus: "warning",
          lastVisit: "2024-01-10",
        },
      ];
      setBoundElders(mockElders);

      const mockHealthData = [
        { type: "心率", value: "72", unit: "bpm", status: "normal" },
        { type: "血压", value: "120/80", unit: "mmHg", status: "normal" },
        { type: "体温", value: "36.5", unit: "°C", status: "normal" },
        { type: "血氧", value: "98", unit: "%", status: "normal" },
      ];
      setHealthData(mockHealthData);
    } catch (error) {
      console.error("加载家属数据失败:", error);
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
      title: "关联老人", 
      dataIndex: "elder", 
      key: "elder",
      render: (elder) => elder?.userName || "-"
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
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card>
            <Statistic
              title="绑定老人"
              value={boundElders.length}
              prefix={<UserOutlined />}
              suffix="位"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="最近告警"
              value={alarmList.length}
              prefix={<AlertOutlined className="text-orange-500" />}
              suffix="条"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="上次探访"
              value={boundElders[0]?.lastVisit || "-"}
              prefix={<AlertFilled />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="我的家人"
            bordered={false}
            extra={
              <Button type="link" href="/home/elder/digitalHealth">
                查看健康详情 <PlusOutlined />
              </Button>
            }
          >
            <div className="space-y-4">
              {boundElders.map((elder) => (
                <Card key={elder.userId} hoverable className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar size={56} icon={<UserOutlined />} />
                      <div className="ml-4">
                        <div className="font-medium text-lg">{elder.userName}</div>
                        <div className="text-sm text-gray-500">
                          <HomeOutlined className="mr-1" />
                          {elder.roomNumber} | {elder.age}岁
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getHealthStatusTag(elder.healthStatus)}
                      <div className="text-sm text-gray-400 mt-1">
                        上次探访: {elder.lastVisit}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="健康数据概览" bordered={false}>
            <div className="grid grid-cols-2 gap-4">
              {healthData.map((item, index) => (
                <Card
                  key={index}
                  className={`${
                    item.status === "warning" ? "border-orange-200" : ""
                  } ${item.status === "urgent" ? "border-red-200" : ""}`}
                >
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

          <Card title="告警通知" bordered={false} className="mt-4">
            <Table
              columns={alarmColumns}
              dataSource={alarmList}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FamilyDashboard;