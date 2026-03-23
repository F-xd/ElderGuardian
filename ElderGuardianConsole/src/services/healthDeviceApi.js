import { get, post } from "../utils/request";

// 获取所有设备
export const apiGetAllHealthDevice = () =>
  get("/healthDevice/getAllHealthDevice");

// 获取设备列表
export const apiHealthDeviceList = (data) => post("/healthDevice/list", data);
