/**
 * 告警状态
 */
export const ALARM_STATUS = {
  UNPROCESSED: 0, //未处理
  PROCESSED: 1, //已处理
};
/**
 * 告警状态选项
 */
export const ALARM_STATUS_OPTIONS = [
  {
    label: "未处理",
    value: ALARM_STATUS.UNPROCESSED,
    color: "#ff4d4f"
  },
  {
    label: "已处理",
    value: ALARM_STATUS.PROCESSED,
    color: "#52c41a"
  },
];
