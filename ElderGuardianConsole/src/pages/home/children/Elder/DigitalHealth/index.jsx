import React, { useEffect, useState } from "react";
import Content from "@/component/Content";
import { Form, Space, Flex, Card, Statistic, Divider, Select } from "antd";
import DeviceSelect from "@/component/DeviceSelect";
import { apiGetElderHealth } from "@/services/userApi";
import ReactECharts from "echarts-for-react";
// import { buildOptions, initOptions } from "./constant";
import CustomDatePicker from "@/component/CustomDatePicker";
import { ROLE } from "@/constant";
import UserSelect from "@/component/UserSelect";

export default function DigitalHealth() {
  const [form] = Form.useForm();
  // const [options, setOptions] = useState({
  //   temperatureHumidityOptions: initOptions,
  //   gasConcentrationOptions: initOptions,
  // });
  // const [statistics, setStatistics] = useState({
  //   temperature: { avg: "0", max: "0", min: "0" },
  //   humidity: { avg: "0", max: "0", min: "0" },
  //   gasConcentration: { avg: "0", max: "0", min: "0" },
  // });

  const getData = async () => {
    const values = form.getFieldsValue();
    const [minTime, maxTime] = values.timeRange || [];
    const {
      data: { content },
    } = await apiGetElderHealth({
      ...values,
      minTime: minTime ? minTime.valueOf() : undefined,
      maxTime: maxTime ? maxTime.valueOf() : undefined,
    });
    // const { temperatureHumidityOptions, gasConcentrationOptions, statistics } =
    //   buildOptions(content);
    // setOptions({
    //   temperatureHumidityOptions,
    //   gasConcentrationOptions,
    // });
    // setStatistics(statistics);
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
            <UserSelect role={ROLE.ELDER} onChange={getData} />
          </Form.Item>
          <Form.Item name="timeRange" label="时间范围">
            <CustomDatePicker onChange={getData} allowClear={false} />
          </Form.Item>
        </Form>
        <Card>
          {/* <DataStatistics statistics={statistics} />
          <Divider />
          <Flex wrap justify="center">
            <ReactECharts
              style={{ width: "50%", minWidth: "400px", height: "300px" }}
              option={options.temperatureHumidityOptions}
            />
            <ReactECharts
              style={{ width: "50%", minWidth: "400px", height: "300px" }}
              option={options.gasConcentrationOptions}
            />
          </Flex> */}
        </Card>
      </Space>
    </Content>
  );
}
