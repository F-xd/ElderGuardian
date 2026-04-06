import { get } from '../utils/request';

// 获取所有设备
export const apiGetAllDevice = () => get('/device/getAllDevice');

// 获取健康设备列表
export const apiGetAllHealthDevice = () => get('/healthDevice/getAllHealthDevice');