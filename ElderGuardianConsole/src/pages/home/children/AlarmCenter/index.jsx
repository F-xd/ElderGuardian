import React, { useState } from "react";
import { getAlarmList } from "@/services/alarmApi";
import ProTable from "@/component/ProTable";
import Content from "@/component/Content";
import { Form } from "antd";
import { getColumns } from "./constant";
import useModal from "@/hooks/useModal";
import AlarmHandleModal from "./component/AlarmHandleModal";
export default function AlarmCenter() {
  const [form] = Form.useForm();
  const [visible, onOpen, onClose] = useModal();
  const [record, setRecord] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  // 搜索前处理
  const handleBeforeSearch = (values) => {
    return values;
  };
  const onDetail = (record) => {
    setRecord(record);
    setIsEdit(false);
    onOpen();
  };
  const onHandle = (record) => {
    setRecord(record);
    setIsEdit(true);
    onOpen();
  };
  const onDelete = (record) => {
    console.log(record);
  };
  return (
    <Content title="告警中心">
      <ProTable
        rowKey="id"
        form={form}
        api={getAlarmList}
        beforeSearch={handleBeforeSearch}
        columns={getColumns(onDetail, onHandle, onDelete)}
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
