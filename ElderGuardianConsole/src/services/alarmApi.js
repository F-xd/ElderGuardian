import { post } from "@/utils/request";
import { get } from "../utils/request";
// 分页查询警报列表
export const getAlarmList = (params) => post("/alarm/list", params);

// 处理警报
export const handleAlarm = (params) => post("/alarm/handle", params);

// 删除警报
export const apiAlarmDelete = (params) => post("/alarm/delete", params);

// 批量删除警报
export const apiAlarmDeleteBatch = (params) =>
  post("/alarm/deleteBatch", params);

// 查询所有未处理的报警
export const getUnhandledAlarmList = () => get("/alarm/unhandled");
