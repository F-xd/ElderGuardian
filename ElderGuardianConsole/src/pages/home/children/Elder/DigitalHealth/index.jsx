import React, { useEffect, useState } from "react";
import Content from "@/component/Content";
import { Form, Space, Flex, Card, Divider } from "antd";
import { apiGetElderHealth } from "@/services/userApi";
import ReactECharts from "echarts-for-react";
import { buildOptions, initOptions } from "./constant";
import CustomDatePicker from "@/component/CustomDatePicker";
import { ROLE } from "@/constant";
import UserSelect from "@/component/UserSelect";
import DataStatistics from "./components/DataStatistics";

export default function DigitalHealth() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState({
    heartRateOptions: initOptions,
    spo2Options: initOptions,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [currentHealth, setCurrentHealth] = useState(null);
  const [roomDevice, setRoomDevice] = useState(null);

  const getData = async () => {
    const values = form.getFieldsValue();
    const [minTime, maxTime] = values.timeRange || [];
    const { data } = await apiGetElderHealth({
      ...values,
      minTime: minTime ? minTime.valueOf() : undefined,
      maxTime: maxTime ? maxTime.valueOf() : undefined,
    });

    if (data) {
      const { heartRateOptions, spo2Options } = buildOptions(data.healthDatas);
      setOptions({
        heartRateOptions,
        spo2Options,
      });
      setUserInfo({
        userName: data.userName,
        gender: data.gender,
        birthday: data.birthday,
        room: data.room,
        phone: data.phone,
        avatar: data.avatar,
      });
      setCurrentHealth(data.healthDevice);
      setRoomDevice(data.roomDevice);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content title="数字健康">
      <Space size={24} orientation="vertical" style={{ width: "100%" }}>
        <Form form={form} layout="inline" onFinish={getData}>
          <Form.Item name="userId" label="老人">
            <UserSelect role={ROLE.ELDER} onChange={getData} showFirst />
          </Form.Item>
          <Form.Item name="timeRange" label="时间范围">
            <CustomDatePicker onChange={getData} allowClear={false} />
          </Form.Item>
        </Form>
        <Card>
          <DataStatistics
            currentHealth={currentHealth}
            userInfo={userInfo}
            roomDevice={roomDevice}
          />
          <Divider />
          <Flex wrap justify="center">
            <ReactECharts
              style={{ width: "50%", minWidth: "400px", height: "300px" }}
              option={options.heartRateOptions}
            />
            <ReactECharts
              style={{ width: "50%", minWidth: "400px", height: "300px" }}
              option={options.spo2Options}
            />
          </Flex>
        </Card>
      </Space>
    </Content>
  );
}
