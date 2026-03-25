import React from "react";
import { Statistic, Flex, Card, Tag, Avatar, Divider } from "antd";
import CountUp from "react-countup";
import { COLORS, GAP } from "@/constant";
import { BASE_URL } from "@/utils/request";

const formatter = (value) => <CountUp end={value} />;

export default function DataStatistics(props) {
  const { currentHealth, userInfo, roomDevice } = props;

  return (
    <Flex gap={GAP.LARGE} justify="space-evenly">
      <Card hoverable style={{ flex: 1, backgroundColor: COLORS.BG_LAYOUT }}>
        <Flex gap={GAP.MEDIUM} justify="space-between" align="center">
          <Card.Meta
            avatar={
              <Avatar
                size={64}
                src={BASE_URL + userInfo?.avatar}
                style={{ backgroundColor: COLORS.PRIMARY, flexShrink: 0 }}
              >
                {userInfo?.userName?.charAt(0)}
              </Avatar>
            }
            title={userInfo?.userName || "-"}
            description={
              <Flex vertical>
                <div>性别: {userInfo?.gender?.genderName || "-"}</div>
                <div>生日: {userInfo?.birthday || "-"}</div>
                <div>电话: {userInfo?.phone || "-"}</div>
              </Flex>
            }
          />
          {currentHealth && (
            <>
              <Statistic
                title="心率"
                value={currentHealth.heartRate}
                suffix="bpm"
                formatter={formatter}
                valueStyle={{ color: COLORS.INFO, fontSize: 20 }}
              />
              <Statistic
                title="血氧"
                value={currentHealth.spo2}
                suffix="%"
                formatter={formatter}
                valueStyle={{ color: COLORS.INFO, fontSize: 20 }}
              />
              <Statistic
                title="状态"
                value={currentHealth.isFallDown ? "摔倒警报" : "状态正常"}
                valueStyle={{
                  color: currentHealth.isFallDown
                    ? COLORS.ERROR
                    : COLORS.SUCCESS,
                  fontSize: 20,
                }}
              />
            </>
          )}
        </Flex>
      </Card>
      <Card hoverable style={{ flex: 1, backgroundColor: COLORS.BG_LAYOUT }}>
        <Flex gap={GAP.LARGE} justify="space-between" align="center">
          <Card.Meta
            title="房间信息"
            description={
              <Flex vertical>
                <div>房间号: {userInfo?.room?.roomNumber || "-"}</div>
                <div>设备: {roomDevice?.deviceName || "-"}</div>
              </Flex>
            }
          />
          {roomDevice && (
            <>
              <Statistic
                title="温度"
                value={roomDevice.temperature}
                suffix="℃"
                formatter={formatter}
                valueStyle={{ color: COLORS.INFO, fontSize: 20 }}
              />
              <Statistic
                title="湿度"
                value={roomDevice.humidity}
                suffix="%"
                formatter={formatter}
                valueStyle={{ color: COLORS.INFO, fontSize: 20 }}
              />
              <Statistic
                title="气体浓度"
                value={roomDevice.gasConcentration}
                suffix="ppm"
                formatter={formatter}
                valueStyle={{ color: COLORS.INFO, fontSize: 20 }}
              />
            </>
          )}
        </Flex>
      </Card>
    </Flex>
  );
}
