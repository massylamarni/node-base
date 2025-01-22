import { useEffect, useState, useRef } from 'react';
import { checkStruct, setChart, getChartData, getMissingData, getAverageChartData, updateChart, fetchRawDataArray } from '../functions/main';

const refreshRate = 5000;
const getChartTimeRange = () => {
  return {"start": new Date(new Date().getTime() - 10 * 60  * 60 * 1000), "end": new Date(new Date().getTime())};
}

export default function SensorChart({ chartInfo }) {
  let missingData = getMissingData([], getChartTimeRange());
  const [data, setData] = useState(null);
  const [chartTimeRange, setChartTimeRange] = useState(getChartTimeRange());
  const [chartData, setChartData] = useState({
      "missingDataBefore": getChartData(missingData.before),
      "sensorData": [],
      "missingDataAfter": getChartData(missingData.after)
  });

  useEffect(() => {
    setChart(chartInfo.id, 1, chartData, chartTimeRange);
    const intervalId = setInterval(() => {
      setChartTimeRange(getChartTimeRange());
      fetchRawDataArray(chartInfo.endpoint.name, setData);
    }, refreshRate);
  }, []);

  useEffect(() => {
    if (checkStruct(data)) {
      missingData = getMissingData(data, chartTimeRange);
      setChartData({
        "missingDataBefore": getChartData(missingData.before),
        "sensorData": getAverageChartData(getChartData(data), chartTimeRange),
        "missingDataAfter": getChartData(missingData.after)
      });
      updateChart(chartInfo.id, chartData, chartTimeRange);
    }
  }, [data]);

  return (
    <div className="sensor-chart">
        <div className='sensor-chart-head'>
            <div className='sensor-chart-title'>
                {chartInfo.info.type}
            </div>
            <div className='sensor-chart-dropdown'>

            </div>
        </div>
        <div className='sensor-chart-body'>
            <canvas className="sensor-chart-chart" id={chartInfo.id}></canvas>
        </div>
    </div>
  );
}
