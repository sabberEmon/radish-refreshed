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
import ExternalTooltipHandler from "@components/utils/ChartCustomTooltipAlt";
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
    gradient?.addColorStop(0, "#de345e33");
    gradient?.addColorStop(1, "#de345e0d");

    return gradient;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        border: { display: true, dash: [5, 5] },
        grid: {
          // display: false,
        },
        ticks: { padding: 14 },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: { display: false, padding: 0 },
        border: { display: false },
      },
    },
    elements: {
      line: { borderWidth: 2 },
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
          borderColor: "#DE345E",
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
    <div className={`h-[${canvasHeight}] mt-3`}>
      <Line ref={chartRef} options={options} data={chartData} />
    </div>
  );
}
