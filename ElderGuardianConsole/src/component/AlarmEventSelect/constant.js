/**
 * 告警事件
 */
export const ALARM_EVENT = {
  SMOKE_WARNING: 0, //浓烟预警
  HIGH_TEMPERATURE_WARNING: 1, //高温预警
  LOW_TEMPERATURE_WARNING: 2, //低温预警
  HUMIDITY_WARNING: 3, //潮湿预警
  DRY_WARNING: 4, //干燥预警
  HEART_RATE_ABNORMAL: 5, //心率异常
  BLOOD_OXYGEN_ABNORMAL: 6, //血氧异常
  FALL_HELP: 7, //跌倒求助
};
/**
 * 告警事件选项
 */
export const ALARM_EVENT_OPTIONS = [
  {
    label: "浓烟预警",
    value: ALARM_EVENT.SMOKE_WARNING,
    color: "#8c8c8c",
  },
  {
    label: "高温预警",
    value: ALARM_EVENT.HIGH_TEMPERATURE_WARNING,
    color: "#fa8c16",
  },
  {
    label: "低温预警",
    value: ALARM_EVENT.LOW_TEMPERATURE_WARNING,
    color: "#1890ff",
  },
  {
    label: "潮湿预警",
    value: ALARM_EVENT.HUMIDITY_WARNING,
    color: "#52c41a",
  },
  {
    label: "干燥预警",
    value: ALARM_EVENT.DRY_WARNING,
    color: "#faad14",
  },
  {
    label: "心率异常",
    value: ALARM_EVENT.HEART_RATE_ABNORMAL,
    color: "#722ed1",
  },
  {
    label: "血氧异常",
    value: ALARM_EVENT.BLOOD_OXYGEN_ABNORMAL,
    color: "#13c2c2",
  },
  {
    label: "跌倒求助",
    value: ALARM_EVENT.FALL_HELP,
    color: "#cf1322",
  },
];
