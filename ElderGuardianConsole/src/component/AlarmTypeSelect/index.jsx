import { Select, Tag } from "antd";
import React from "react";
import { ALARM_TYPE_OPTIONS } from "./constant";
export const AlarmTypeTag = ({ alarmType }) => {
  // 告警类型或告警类型值(可以传对象或者值)
  const id = alarmType?.id !== undefined ? alarmType.id : alarmType;
  const { label, color } = 
    ALARM_TYPE_OPTIONS.find((item) => item.value === id) || {};
  return (
    <Tag variant="solid" color={color || "blue"}>
      {label || "-"}
    </Tag>
  );
};
export default function AlarmTypeSelect() {
  return (
    <Select
      options={ALARM_TYPE_OPTIONS}
      optionRender={(option) => <AlarmTypeTag alarmType={option.value} />}
      labelRender={(labelInValueType) => (
        <AlarmTypeTag alarmType={labelInValueType.value} />
      )}
      allowClear
      placeholder={<span style={{ padding: "0 8px" }}>告警类型</span>}
    />
  );
}
