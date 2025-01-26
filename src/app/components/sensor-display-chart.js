import { useEffect, useState, useRef } from 'react';
import { checkStruct, setChart, getChartData, getMissingData, updateChart, fetchRawDataArray, getAverageChartData, getGroupedChartData } from '../functions/main';
import Select from './inputs/select';

export default function SensorDisplayChart({ chartInfo, refreshRate }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState({'name': 'Last 24 hours', 'value': {'start': 24 * 60 * 60 * 1000, 'end': 0}});
  const getChartTimeRange = () => {
    return {"start": new Date(new Date().getTime() - selectedTimeRange.value.start), "end": new Date(new Date().getTime() - selectedTimeRange.value.end)};
  }
  const [data, setData] = useState(null);
  const [chartTimeRange, setChartTimeRange] = useState(getChartTimeRange());
  let missingData = getMissingData([], getChartTimeRange());
  let chartData = {
      "missingDataBefore": getChartData(missingData.before),
      "sensorData": [],
      "missingDataAfter": getChartData(missingData.after)
  };

  useEffect(() => {
    const chart = setChart(chartInfo.id, 1, chartData, chartTimeRange);
    return () => { if (chart) chart.destroy(); }
  }, []);

  useEffect(() => {
    setChartTimeRange(getChartTimeRange());
    fetchRawDataArray(chartInfo.endpoint.name, setData, chartTimeRange);
    const intervalId = setInterval(() => {
      setChartTimeRange(getChartTimeRange());
      fetchRawDataArray(chartInfo.endpoint.name, setData, chartTimeRange);
    }, refreshRate);
    return () => clearInterval(intervalId);
  }, [refreshRate, selectedTimeRange]);

  useEffect(() => {
    fetchRawDataArray(chartInfo.endpoint.name, setData, chartTimeRange);
  }, [chartTimeRange]);

  useEffect(() => {
    if (checkStruct(data)) {
      missingData = getMissingData(data, chartTimeRange);
      chartData = {
        "missingDataBefore": getChartData(missingData.before),
        "sensorData": chartInfo.type == 'data' ? getAverageChartData(getChartData(data), chartTimeRange) : getGroupedChartData(getChartData(data), chartTimeRange),
        "missingDataAfter": getChartData(missingData.after)
      };
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
              <Select options={[
                {'name': 'Last 24 hours', 'value': {'start': 24 * 60 * 60 * 1000, 'end': 0}},
                {'name': 'Last 12 hours', 'value': {'start': 12 * 60 * 60 * 1000, 'end': 0}},
                {'name': 'Last 1 hour', 'value': {'start': 1 * 60 * 60 * 1000, 'end': 0}},
                {'name': 'Last 30 minutes', 'value': {'start': 30 * 60 * 1000, 'end': 0}},
              ]} selected={selectedTimeRange} setSelected={setSelectedTimeRange}/>
            </div>
        </div>
        <div className='sensor-chart-body'>
          <div className='sensor-display-data-chart-detailed'>
            <canvas className="sensor-display-chart" id={chartInfo.id}></canvas>
          </div> 
        </div>
    </div>
  );
}
