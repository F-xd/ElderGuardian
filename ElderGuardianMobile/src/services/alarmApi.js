import { post, get } from '../utils/request';

// 获取告警列表
export const apiGetAlarmList = (params) => post('/alarm/list', params);

// 处理告警
export const apiHandleAlarm = (params) => post('/alarm/handle', params);

// 获取未处理告警
export const apiGetUnhandledAlarmList = () => get('/alarm/unhandled');

// 获取告警详情
export const apiGetAlarmById = (id) => post('/alarm/list', { condition: { id }, pageNumber: 1, pageSize: 10 });