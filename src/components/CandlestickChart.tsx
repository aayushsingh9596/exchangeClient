import { useEffect, useRef } from "react";
import { ICandleStickData } from "../types/types";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
} from "lightweight-charts";

interface Props {
  candleSticksData: ICandleStickData[];
}

const CandlestickChart = ({ candleSticksData }: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || candleSticksData.length === 0) return;

    if (!chartRef.current) {
      const chartOptions = {
        width: chartContainerRef.current.clientWidth,
        height: 450,
        layout: {
          textColor: "#333",
          background: {
            type: ColorType.Solid,
            color: "#ffffff",
          },
        },
        grid: {
          vertLines: {
            color: "#eee",
          },
          horzLines: {
            color: "#eee",
          },
        },
        crosshair: {
          mode: 0,
        },
        priceScale: {
          borderColor: "#ccc",
        },
        timeScale: {
          borderColor: "#ccc",
        },
      };

      const chart = createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      const candleStickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#4caf50",
        downColor: "#f44336",
        borderVisible: false,
        wickUpColor: "#4caf50",
        wickDownColor: "#f44336",
      });

      candleSeriesRef.current = candleStickSeries;
      chart.timeScale().fitContent();
    }

    if (candleSeriesRef.current) {
      candleSeriesRef.current.setData(candleSticksData);
    }

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [candleSticksData]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-[400px] p-4 rounded-lg shadow bg-white border border-gray-200"
    />
  );
};

export default CandlestickChart;
