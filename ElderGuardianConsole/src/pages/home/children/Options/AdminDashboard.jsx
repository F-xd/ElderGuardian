import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Table, Tag } from "antd";
import Content from "@/component/Content";

import {
  AlertOutlined,
  HomeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  AlertFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getAlarmList } from "../../../../services/alarmApi";
import { apiRoomList } from "../../../../services/roomApi";
import { apiDeviceList } from "../../../../services/deviceApi";
import { apiGetUserList } from "../../../../services/userApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalElders: 0,
    totalDevices: 0,
    activeDevices: 0,
    unhandledAlarms: 0,
  });
  const [alarmList, setAlarmList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [alarmRes, roomRes, deviceRes, userRes] = await Promise.all([
          getAlarmList({ pageNumber: 1, pageSize: 10 }),
          apiRoomList({ pageNumber: 1, pageSize: 100 }),
          apiDeviceList({ pageNumber: 1, pageSize: 100 }),
          apiGetUserList({ pageNumber: 1, pageSize: 100 }),
        ]);

        if (alarmRes.code === 200) {
          const alarmContent = alarmRes.data.content || [];
          const unhandledCount = alarmContent.filter(
            (a) => a.alarmStatus?.id === 0 || a.alarmStatus === 0,
          ).length;
          setAlarmList(alarmContent.slice(0, 5));
          setStats((prev) => ({ ...prev, unhandledAlarms: unhandledCount }));
        }

        if (roomRes.code === 200) {
          const rooms = roomRes.data.content || [];
          const occupied = rooms.filter((r) => r.users.length !== 0).length;
          setRoomList(rooms.slice(0, 5));
          setStats((prev) => ({
            ...prev,
            totalRooms: rooms.length,
            occupiedRooms: occupied,
          }));
        }

        if (deviceRes.code === 200) {
          const devices = deviceRes.data.content || [];
          const active = devices.filter(
            (d) => new Date().valueOf() - d.time <= 60000,
          ).length;
          setStats((prev) => ({
            ...prev,
            totalDevices: devices.length,
            activeDevices: active,
          }));
        }

        if (userRes.code === 200) {
          const users = userRes.data.content || [];
          const elders = users.filter(
            (u) => u.role?.roleId === 0 || u.role === 0,
          );
          setStats((prev) => ({ ...prev, totalElders: elders.length }));
        }
      } catch (error) {
        console.error("加载仪表盘数据失败:", error);
      }
    };
    loadDashboardData();
  }, []);

  const alarmColumns = [
    {
      title: "告警类型",
      dataIndex: "alarmType",
      key: "alarmType",
      render: (alarmType) => alarmType?.name || alarmType,
    },
    {
      title: "告警事件",
      dataIndex: "alarmEvent",
      key: "alarmEvent",
      render: (alarmEvent) => alarmEvent?.name || alarmEvent,
    },
    {
      title: "关联房间",
      dataIndex: "room",
      key: "room",
      render: (room) => room?.roomNumber || "-",
    },
    {
      title: "关联老人",
      dataIndex: "elder",
      key: "elder",
      render: (elder) => elder?.userName || "-",
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
      },
    },
  ];

  const roomColumns = [
    { title: "房间号", dataIndex: "roomNumber", key: "roomNumber" },
    {
      title: "容量",
      dataIndex: "maxCapacity",
      key: "maxCapacity",
      render: (maxCapacity, record) =>
        `${record.currentCount || 0}/${maxCapacity}`,
    },
    {
      title: "入住率",
      dataIndex: "occupancyRate",
      key: "occupancyRate",
      render: (rate) => `${(rate * 100).toFixed(0)}%`,
    },
    {
      title: "状态",
      dataIndex: "currentCount",
      key: "status",
      render: (currentCount) =>
        currentCount > 0 ? (
          <Tag color="green">已入住</Tag>
        ) : (
          <Tag color="gray">空房</Tag>
        ),
    },
  ];

  return (
    <Content className="dashboard">
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="房间总数"
              value={stats.totalRooms}
              prefix={<HomeOutlined />}
              suffix={`已入住 ${stats.occupiedRooms}`}
            />
            <Progress
              percent={
                stats.totalRooms > 0
                  ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
                  : 0
              }
              strokeColor="#1890ff"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="老人"
              value={stats.totalElders}
              prefix={<UserOutlined />}
              suffix="位"
            />
            <div className="mt-3">
              <span className="text-gray-500 text-sm">实时监护中</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={stats.totalDevices}
              prefix={
                stats.activeDevices === stats.totalDevices ? (
                  <CheckCircleOutlined className="text-green-500" />
                ) : (
                  <CloseCircleOutlined className="text-yellow-500" />
                )
              }
              suffix={`在线 ${stats.activeDevices}`}
            />
            <Progress
              percent={
                stats.totalDevices > 0
                  ? Math.round((stats.activeDevices / stats.totalDevices) * 100)
                  : 0
              }
              strokeColor="#52c41a"
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理告警"
              value={stats.unhandledAlarms}
              prefix={<AlertOutlined className="text-red-500" />}
              valueStyle={{ color: "#f5222d" }}
            />
            <div className="mt-3">
              <span className="text-gray-500 text-sm">
                <AlertFilled className="mr-1" />
                需要立即处理
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="最新告警" bordered={false}>
            <Table
              columns={alarmColumns}
              dataSource={alarmList}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="房间状态" bordered={false}>
            <Table
              columns={roomColumns}
              dataSource={roomList}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default AdminDashboard;
