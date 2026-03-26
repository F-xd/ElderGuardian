import { Select, Tag } from "antd";
import React from "react";
import { ALARM_EVENT_OPTIONS } from "./constant";
export const AlarmEventTag = ({ alarmEvent, alarm, ...rest }) => {
  // 房间名称
  const roomName = alarm?.room?.roomNumber || "";
  // 人姓名
  const userName = alarm?.elder?.userName || "";
  // 告警事件或告警事件值(可以传对象或者值)
  const id = alarmEvent?.id !== undefined ? alarmEvent.id : alarmEvent;
  const { label, color } =
    ALARM_EVENT_OPTIONS.find((item) => item.value === id) || {};
  return (
    <Tag {...rest} variant="solid" color={color || "blue"}>
      {`${roomName} ${userName} ${label || ""}`}
    </Tag>
  );
};
export default function AlarmEventSelcet() {
  return (
    <Select
      options={ALARM_EVENT_OPTIONS}
      optionRender={(option) => <AlarmEventTag alarmEvent={option.value} />}
      labelRender={(labelInValueType) => (
        <AlarmEventTag alarmEvent={labelInValueType.value} />
      )}
      allowClear
      placeholder={<span style={{ padding: "0 8px" }}>告警事件</span>}
    />
  );
}
