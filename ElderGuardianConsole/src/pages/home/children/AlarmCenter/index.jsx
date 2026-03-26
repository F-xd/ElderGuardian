import React, { useState } from "react";
import {
  getAlarmList,
  apiAlarmDelete,
  apiAlarmDeleteBatch,
} from "@/services/alarmApi";
import ProTable from "@/component/ProTable";
import Content from "@/component/Content";
import { Button, Form, message, Modal } from "antd";
import { getColumns } from "./constant";
import useModal from "@/hooks/useModal";
import AlarmHandleModal from "./component/AlarmHandleModal";
import { DeleteOutlined } from "@ant-design/icons";
export default function AlarmCenter() {
  const [form] = Form.useForm();
  const [visible, onOpen, onClose] = useModal();
  const [record, setRecord] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { confirm } = Modal;
  // 搜索前处理
  const handleBeforeSearch = (values) => {
    return values;
  };
  // 查看告警详情
  const onDetail = (record) => {
    setRecord(record);
    setIsEdit(false);
    onOpen();
  };
  // 处理告警
  const onHandle = (record) => {
    setRecord(record);
    setIsEdit(true);
    onOpen();
  };
  // 删除告警
  const onDelete = (record) => {
    console.log(record);
    confirm({
      title: "提示",
      content: <>确认删除告警吗？</>,
      onOk: async () => {
        await apiAlarmDelete({ id: record.id });
        setSelectedRowKeys([]);
        form.getData();
      },
      centered: true,
    });
  };
  // 批量删除告警
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要删除的告警");
      return;
    }
    confirm({
      title: "提示",
      content: `确认删除选中的 ${selectedRowKeys.length} 个告警吗？`,
      onOk: async () => {
        await apiAlarmDeleteBatch({ ids: selectedRowKeys });
        setSelectedRowKeys([]);
        form.getData();
      },
    });
  };
  return (
    <Content title="告警中心">
      <ProTable
        rowKey="id"
        form={form}
        api={getAlarmList}
        beforeSearch={handleBeforeSearch}
        columns={getColumns(onDetail, onHandle, onDelete)}
        extraOptions={[
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>,
        ]}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selectedRowKeys,
          preserveSelectedRowKeys: true,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
      {visible && (
        <AlarmHandleModal
          visible={visible}
          onCancel={onClose}
          onOk={form.getData}
          alarm={record}
          isEdit={isEdit}
        />
      )}
    </Content>
  );
}
