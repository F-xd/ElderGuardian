import { post } from "@/utils/request";
// 分页查询警报列表
export const getAlarmList = (params) => post("/alarm/list", params);

// 处理警报
export const handleAlarm = (params) => post("/alarm/handle", params);
