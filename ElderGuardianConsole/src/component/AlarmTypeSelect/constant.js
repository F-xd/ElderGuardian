/**
 * 告警类型
 */
export const ALARM_TYPE = {
  ROOM_ALARM: 0, //房间警报
  HEALTH_ALARM: 1, //健康警报
};
/**
 * 告警类型选项
 */
export const ALARM_TYPE_OPTIONS = [
  {
    label: "房间警报",
    value: ALARM_TYPE.ROOM_ALARM,
    color: "#1890ff"
  },
  {
    label: "健康警报",
    value: ALARM_TYPE.HEALTH_ALARM,
    color: "#722ed1"
  },
];
