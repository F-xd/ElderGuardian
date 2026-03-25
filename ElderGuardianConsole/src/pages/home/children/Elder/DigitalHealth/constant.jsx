import { COLORS } from "@/constant";

export const initOptions = {
  backgroundColor: "rgba(255, 255, 255, 0)",
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: COLORS.BORDER_SECONDARY,
    borderWidth: 1,
    textStyle: {
      color: COLORS.TEXT_BASE,
    },
    axisPointer: {
      type: "line",
      lineStyle: {
        color: COLORS.PRIMARY,
        type: "dashed",
      },
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
      bottom: 10,
      height: 20,
      handleStyle: {
        color: COLORS.PRIMARY,
        shadowBlur: 3,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffsetX: 1,
        shadowOffsetY: 1,
      },
    },
  ],
  legend: {
    data: [],
    textStyle: {
      color: COLORS.TEXT_SECONDARY,
    },
  },
  xAxis: {
    data: [],
    axisLine: {
      lineStyle: {
        color: COLORS.BORDER_SECONDARY,
      },
    },
    axisLabel: {
      color: COLORS.TEXT_TERTIARY,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: COLORS.TEXT_TERTIARY,
    },
    splitLine: {
      lineStyle: {
        color: COLORS.FILL_QUATERNARY,
        type: "dashed",
      },
    },
  },
  series: [],
};

const createSeries = (name, colorConfig) => ({
  sampling: "lttb",
  name,
  type: "line",
  data: [],
  smooth: true,
  symbol: "circle",
  symbolSize: 6,
  showSymbol: false,
  lineStyle: {
    width: 3,
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: colorConfig.lineStart },
        { offset: 1, color: colorConfig.lineEnd },
      ],
    },
  },
  itemStyle: {
    color: colorConfig.lineStart,
    borderColor: COLORS.BG_BASE,
    borderWidth: 2,
  },
  areaStyle: {
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: colorConfig.areaStart },
        { offset: 1, color: colorConfig.areaEnd },
      ],
    },
  },
});

const createChartOptions = (title, legendData, series) => ({
  ...initOptions,
  title: {
    left: "left",
    text: title,
    textStyle: {
      color: COLORS.TEXT_BASE,
      fontSize: 16,
      fontWeight: "bold",
    },
  },
  legend: {
    data: legendData,
    top: 20,
    textStyle: {
      color: COLORS.TEXT_SECONDARY,
    },
  },
  xAxis: { data: [] },
  series,
});

const SERIES_COLORS = {
  heartRate: {
    lineStart: COLORS.ERROR,
    lineEnd: "#ff888a",
    areaStart: "rgba(255, 77, 79, 0.25)",
    areaEnd: "rgba(255, 77, 79, 0.02)",
  },
  spo2: {
    lineStart: COLORS.PRIMARY,
    lineEnd: "#9a8ee8",
    areaStart: "rgba(114, 101, 227, 0.25)",
    areaEnd: "rgba(114, 101, 227, 0.02)",
  },
};

export const buildOptions = (healthDatas = []) => {
  const heartRateOptions = createChartOptions(
    "心率变化趋势",
    ["心率"],
    [createSeries("心率", SERIES_COLORS.heartRate)]
  );

  const spo2Options = createChartOptions(
    "血氧饱和度变化趋势",
    ["血氧饱和度"],
    [createSeries("血氧饱和度", SERIES_COLORS.spo2)]
  );

  healthDatas.forEach((item) => {
    const time = new Date(item.time).toLocaleString();
    heartRateOptions.xAxis.data.push(time);
    heartRateOptions.series[0].data.push(item.heartRate);
    spo2Options.xAxis.data.push(time);
    spo2Options.series[0].data.push(item.spo2);
  });

  return {
    heartRateOptions,
    spo2Options,
  };
};
