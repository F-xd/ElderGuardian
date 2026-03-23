import React, { useEffect, useState } from "react";
import Content from "@/component/Content";
import ProTable from "../../../../component/ProTable";
import { Form, Switch } from "antd";
import { apiDeviceList } from "../../../../services/deviceApi";
import { apiHealthDeviceList } from "../../../../services/healthDeviceApi";
import { getColumns } from "./constant";
import DeviceCard from "./component/DeviceCard";
import HealthDeviceCard from "./component/HealthDeviceCard";
export default function Device() {
  const [form] = Form.useForm();
  const [isHealthDevice, setIsHealthDevice] = useState(false);
  useEffect(() => {
    form.resetFields();
    form.getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHealthDevice]);
  return (
    <Content title="设备中心">
      <Switch
        checkedChildren="健康"
        unCheckedChildren="环境"
        checked={isHealthDevice}
        onChange={(checked) => {
          setIsHealthDevice(checked);
        }}
        style={{ background: isHealthDevice ? "green" : "purple" }}
      />
      <ProTable
        rowKey="deviceId"
        form={form}
        api={isHealthDevice ? apiHealthDeviceList : apiDeviceList}
        columns={getColumns()}
        paginationConfig={{
          align: "start",
          pageSizeOptions: [8, 12, 16, 20],
        }}
        masonryConfig={{
          columns: {
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4,
          },
          itemRender: (item) =>
            isHealthDevice ? (
              <HealthDeviceCard item={item} />
            ) : (
              <DeviceCard item={item} />
            ),
        }}
      />
    </Content>
  );
}
