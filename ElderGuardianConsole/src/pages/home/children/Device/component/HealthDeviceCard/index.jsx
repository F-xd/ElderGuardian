import React from "react";
import { Card, Statistic, Tag, Flex, Avatar, Space } from "antd";
import CountUp from "react-countup";
import { getDeviceStatus } from "./constant";
import DeviceNameTag from "../../../../../../component/DeviceNameTag";
const formatter = (value) => <CountUp end={value} />;
import { BASE_URL } from "../../../../../../utils/request";

export default function HealthDeviceCard(props) {
  const { item } = props;
  const { deviceName, heartRate, spo2, isFallDown, time, user } = item;
  return (
    <Card
      hoverable
      style={{ backgroundColor: "#c156e108" }}
      extra={
        <Space>
          <Avatar src={BASE_URL + user?.avatar} />
          {user?.userName}
        </Space>
      }
      title={<DeviceNameTag isHealthDevice deviceName={deviceName} />}
      actions={[
        getDeviceStatus(time),
        <Tag>{new Date(time).toLocaleString()}</Tag>,
      ]}
    >
      <Flex wrap justify="space-between" gap={10}>
        <Statistic
          title="心率"
          value={heartRate}
          suffix="bpm"
          formatter={formatter}
        />
        <Statistic title="血氧" value={spo2} suffix="%" formatter={formatter} />
        <Statistic
          title="是否跌倒"
          value={isFallDown}
          suffix=""
          formatter={(value) => (
            <Tag variant="solid" color={value ? "red" : "green"}>
              {value ? "是" : "否"}
            </Tag>
          )}
        />
      </Flex>
    </Card>
  );
}
