import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import ExternalTooltipHandler from "@components/utils/ChartCustomTooltip";
import { Card } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function ChartComponent({
  yData,
  xData,
  fontSize = 12.75,
  fontColor = "#979797",
  canvasHeight,
}) {
  const [chartData, setChartData] = useState({ datasets: [] });
  const chartRef = useRef(null);

  ChartJS.defaults.font.size = fontSize;
  ChartJS.defaults.color = fontColor;

  const createGradientBg = (context) => {
    const gradient = context?.createLinearGradient(0, 0, 0, 180);
    gradient?.addColorStop(0, "#FFFFFF00");
    gradient?.addColorStop(1, "#04C976");

    return gradient;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    tooltips: {
      enabled: false,
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 2 },
      point: { radius: 0, hoverRadius: 0 },
    },
    plugins: {
      tooltip: {
        enabled: false,
        position: "nearest",
        external: ExternalTooltipHandler,
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const data = {
      labels: xData,
      datasets: [
        {
          fill: true,
          data: yData,
          borderColor: "#04C976",
        },
      ],
    };

    setChartData({
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: createGradientBg(chartRef?.current?.ctx),
      })),
    });
  }, [xData, yData]);

  return (
    <div className={`min-[2000px]:h-[150px] h-[80px] mt-3 px-2`}>
      <Line ref={chartRef} options={options} data={chartData} />
    </div>
  );
}
