import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Avatar, Button } from "antd";
import {
  AlertFilled,
  AlertOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getAlarmList } from "../../../../services/alarmApi";
import { apiGetUserList } from "../../../../services/userApi";

const CaregiverDashboard = () => {
  const [careElders, setCareElders] = useState([]);
  const [alarmList, setAlarmList] = useState([]);
  const [healthStats, setHealthStats] = useState({
    normal: 0,
    warning: 0,
    urgent: 0,
  });

  useEffect(() => {
    loadCaregiverData();
  }, []);

  const loadCaregiverData = async () => {
    try {
      const [alarmRes, userRes] = await Promise.all([
        getAlarmList({ pageNumber: 1, pageSize: 10 }),
        apiGetUserList({ pageNumber: 1, pageSize: 100 }),
      ]);

      if (alarmRes.code === 200) {
        setAlarmList((alarmRes.data.content || []).slice(0, 5));
      }

      if (userRes.code === 200) {
        const users = userRes.data.content || [];
        const elders = users.filter((u) => u.role?.roleId === 0 || u.role === 0);
        const mockElders = elders.map((elder) => ({
          ...elder,
          healthStatus: Math.random() > 0.8 ? "warning" : Math.random() > 0.9 ? "urgent" : "normal",
          lastCheckTime: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        }));
        setCareElders(mockElders.slice(0, 6));
        
        const normal = mockElders.filter((e) => e.healthStatus === "normal").length;
        const warning = mockElders.filter((e) => e.healthStatus === "warning").length;
        const urgent = mockElders.filter((e) => e.healthStatus === "urgent").length;
        setHealthStats({ normal, warning, urgent });
      }
    } catch (error) {
      console.error("加载护理人员数据失败:", error);
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
              title="负责老人"
              value={careElders.length}
              prefix={<UserOutlined />}
              suffix="位"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="健康正常"
              value={healthStats.normal}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              suffix="位"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待处理告警"
              value={alarmList.filter((a) => a.alarmStatus?.id === 0 || a.alarmStatus === 0).length}
              prefix={<AlertOutlined className="text-red-500" />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="负责老人列表"
            bordered={false}
            extra={
              <Button type="link" href="/home/elder/elderList">
                查看全部 <PlusOutlined />
              </Button>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              {careElders.map((elder) => (
                <Card
                  key={elder.userId}
                  hoverable
                  className="cursor-pointer"
                  onClick={() => (window.location.href = `/home/elder/digitalHealth?id=${elder.userId}`)}
                >
                  <div className="flex items-center">
                    <Avatar size={48} icon={<UserOutlined />} />
                    <div className="ml-3">
                      <div className="font-medium">{elder.userName}</div>
                      <div className="text-sm text-gray-500">
                        <AlertFilled className="mr-1" />
                        {elder.lastCheckTime}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">{getHealthStatusTag(elder.healthStatus)}</div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="待处理告警"
            bordered={false}
            extra={
              <Button type="link" href="/home/AlarmCenter">
                查看全部 <PlusOutlined />
              </Button>
            }
          >
            <Table
              columns={alarmColumns}
              dataSource={alarmList.filter((a) => a.alarmStatus?.id === 0 || a.alarmStatus === 0)}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CaregiverDashboard;