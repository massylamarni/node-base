import { useState, useEffect, useRef } from 'react';
import { checkStruct, getDisplayData, setChart, getChartData, getMissingData, updateChart, fetchRawDataArray } from '../functions/main';

const refreshRate = 5000;
const getChartTimeRange = () => {
  return {"start": new Date(new Date().getTime() - 1 * 60 * 1000), "end": new Date(new Date().getTime())};
}

export default function SensorDisplayData({ chartInfo }) {
  let missingData = getMissingData([], getChartTimeRange());
  const [data, setData] = useState(null);
  const [chartTimeRange, setChartTimeRange] = useState(getChartTimeRange());
  const [chartData, setChartData] = useState({
      "missingDataBefore": getChartData(missingData.before),
      "sensorData": [],
      "missingDataAfter": getChartData(missingData.after)
  });
  let displayData = getDisplayData(data, getChartTimeRange());
  
  useEffect(() => {
    setChart(chartInfo.id, 0, chartData, chartTimeRange);
    const intervalId = setInterval(() => {
      setChartTimeRange(getChartTimeRange());
      fetchRawDataArray(chartInfo.endpoint.name, setData);
    }, refreshRate);
  }, []);

  useEffect(() => {
    if (checkStruct(data)) {
      missingData = getMissingData(data, chartTimeRange);
      displayData = getDisplayData(data, chartTimeRange);
      setChartData({
        "missingDataBefore": getChartData(missingData.before),
        "sensorData": getChartData(data),
        "missingDataAfter": getChartData(missingData.after)
      });
      updateChart(chartInfo.id, chartData, chartTimeRange);
    }
  }, [data]);

  return (
    <div className="sensor-display">
      <div className="sensor-display-head">
        <div>
            {chartInfo.id == 'chart-d1' && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                <path
                d="M12 9C11.1077 8.98562 10.2363 9.27003 9.52424 9.808C8.81222 10.346 8.30055 11.1066 8.07061 11.9688C7.84068 12.8311 7.90568 13.7455 8.25529 14.5665C8.6049 15.3876 9.21904 16.0682 10 16.5M12 3V5M6.6 18.4L5.2 19.8M4 13H2M6.6 7.6L5.2 6.2M20 14.5351V4C20 2.89543 19.1046 2 18 2C16.8954 2 16 2.89543 16 4V14.5351C14.8044 15.2267 14 16.5194 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 16.5194 21.1956 15.2267 20 14.5351Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>}
            {chartInfo.id == 'chart-d2' && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
              <path 
                d="M3 8H10C11.6569 8 13 6.65685 13 5C13 3.34315 11.6569 2 10 2C8.34315 2 7 3.34315 7 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M4 16H15C16.6569 16 18 17.3431 18 19C18 20.6569 16.6569 22 15 22C13.3431 22 12 20.6569 12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M2 12H19C20.6569 12 22 10.6569 22 9C22 7.34315 20.6569 6 19 6C17.3431 6 16 7.34315 16 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>}
            {chartInfo.id == 2 && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                <path
                d="M12 9C11.1077 8.98562 10.2363 9.27003 9.52424 9.808C8.81222 10.346 8.30055 11.1066 8.07061 11.9688C7.84068 12.8311 7.90568 13.7455 8.25529 14.5665C8.6049 15.3876 9.21904 16.0682 10 16.5M12 3V5M6.6 18.4L5.2 19.8M4 13H2M6.6 7.6L5.2 6.2M20 14.5351V4C20 2.89543 19.1046 2 18 2C16.8954 2 16 2.89543 16 4V14.5351C14.8044 15.2267 14 16.5194 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 16.5194 21.1956 15.2267 20 14.5351Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>}
        </div>
        <div>
          <div className="sensor-display-title">
            <div>{displayData.value}</div>
            <div>{chartInfo.info.unit}</div>
          </div>
          <div className="sensor-display-subtitle">
            {chartInfo.info.type}
          </div>
        </div>
      </div>
      <div className="sensor-display-body">
        <div className="sensor-display-peaks">
          <div>
            <div>Max today</div>
            <div>{displayData.peaks.max}</div>
          </div>
          <div>
            <div>Min today</div>
            <div>{displayData.peaks.min}</div>
          </div>
        </div>
        <canvas className="sensor-display-chart" id={chartInfo.id}></canvas>
      </div>
    </div>
  );
}
