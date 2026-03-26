import { Select, Tag } from "antd";
import React from "react";
import { ALARM_STATUS_OPTIONS } from "./constant";
export const AlarmStatusTag = ({ alarmStatus }) => {
  // 告警状态或告警状态值(可以传对象或者值)
  const id = alarmStatus?.id !== undefined ? alarmStatus.id : alarmStatus;
  const { label, color } = 
    ALARM_STATUS_OPTIONS.find((item) => item.value === id) || {};
  return (
    <Tag variant="solid" color={color || "blue"}>
      {label || "-"}
    </Tag>
  );
};
export default function AlarmStatusSelect() {
  return (
    <Select
      options={ALARM_STATUS_OPTIONS}
      optionRender={(option) => <AlarmStatusTag alarmStatus={option.value} />}
      labelRender={(labelInValueType) => (
        <AlarmStatusTag alarmStatus={labelInValueType.value} />
      )}
      allowClear
      placeholder={<span style={{ padding: "0 8px" }}>告警状态</span>}
    />
  );
}
