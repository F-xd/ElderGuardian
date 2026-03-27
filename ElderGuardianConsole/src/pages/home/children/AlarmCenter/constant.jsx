import AlarmEventSelcet, { AlarmEventTag } from "@/component/AlarmEventSelect";
import AlarmTypeSelect, { AlarmTypeTag } from "@/component/AlarmTypeSelect";
import AlarmStatusSelect, {
  AlarmStatusTag,
} from "@/component/AlarmStatusSelect";
import { Button, InputNumber, Space } from "antd";
import WithPermission from "../../../../component/WithPermission";
// 表格列配置
export const getColumns = (onDetail, onHandle, onDelete) => {
  return [
    {
      title: "警报ID",
      dataIndex: "id",
      key: "id",
      formItemProps: {
        render: () => <InputNumber min={0} />,
      },
    },
    {
      title: "警报类型",
      dataIndex: "alarmType",
      key: "alarmType",
      render: (text) => <AlarmTypeTag alarmType={text} />,
      formItemProps: {
        render: AlarmTypeSelect,
      },
    },
    {
      title: "警报事件",
      dataIndex: "alarmEvent",
      key: "alarmEvent",
      render: (alarmEvent) => <AlarmEventTag alarmEvent={alarmEvent} />,
      formItemProps: {
        render: AlarmEventSelcet,
      },
    },
    {
      title: "警报状态",
      dataIndex: "alarmStatus",
      key: "alarmStatus",
      render: (text) => <AlarmStatusTag alarmStatus={text} />,
      formItemProps: {
        render: AlarmStatusSelect,
      },
    },
    {
      title: "警报房间",
      dataIndex: "room",
      key: "room",
      render: (room) => room?.roomNumber || "-",
      formItemProps: {
        render: false,
      },
    },
    {
      title: "警报人",
      dataIndex: "elder",
      key: "elder",
      render: (elder) => elder?.userName || "-",
      formItemProps: {
        render: false,
      },
    },
    {
      title: "警报时间",
      dataIndex: "alarmTime",
      key: "alarmTime",
      render: (text) => {
        if (!text) return "-";
        return new Date(text).toLocaleString();
      },
      formItemProps: {
        render: false,
      },
      sorter: 1,
    },
    {
      title: "处理时间",
      dataIndex: "handleTime",
      key: "handleTime",
      render: (text) => {
        if (!text) return "-";
        return new Date(text).toLocaleString();
      },
      formItemProps: {
        render: false,
      },
      sorter: 2,
    },
    {
      title: "处理人",
      dataIndex: "handleUser",
      key: "handleUser",
      render: (user) => user?.userName || "-",
      formItemProps: {
        render: false,
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      fixed: "end",
      formItemProps: {
        render: false,
      },
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onDetail(record)}>
            查看
          </Button>
          <WithPermission permission={["admin", "caregiver"]}>
            <Button type="primary" onClick={() => onHandle(record)}>
              处理
            </Button>
          </WithPermission>
          <WithPermission permission={["admin"]}>
            <Button type="primary" danger onClick={() => onDelete(record)}>
              删除
            </Button>
          </WithPermission>
        </Space>
      ),
    },
  ];
};
