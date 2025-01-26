import { useState, useEffect, useRef } from 'react';
import { checkStruct, getDisplayData, getDisplayStateData, setChart, getChartData, getMissingData, updateChart, fetchRawDataArray } from '../functions/main';



export default function SensorDisplayData({ chartInfo, refreshRate, setSelectedSensor }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState({'name': 'Last 1 minute', 'value': {'start': 1 * 60 * 1000, 'end': 0}});
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
  let displayData = chartInfo.type == 'data' ? getDisplayData(data, getChartTimeRange()) : getDisplayStateData(data, true, getChartTimeRange());;
  
  useEffect(() => {
    const chart = setChart(chartInfo.id, 0, chartData, chartTimeRange);
    return () => { if (chart) chart.destroy(); }
  }, []);

  useEffect(() => {
    setChartTimeRange(getChartTimeRange());
    const intervalId = setInterval(() => {
      setChartTimeRange(getChartTimeRange());
    }, refreshRate);
    return () => clearInterval(intervalId);
  }, [refreshRate, selectedTimeRange]);

  useEffect(() => {
      fetchRawDataArray(chartInfo.endpoint.name, setData, chartTimeRange);
  }, [chartTimeRange]);

  useEffect(() => {
    if (checkStruct(data)) {
      missingData = getMissingData(data, chartTimeRange);
      displayData = chartInfo.type == 'data' ? getDisplayData(data, chartTimeRange) : getDisplayStateData(data, true, getChartTimeRange());;
      chartData = {
        "missingDataBefore": getChartData(missingData.before),
        "sensorData": getChartData(data),
        "missingDataAfter": getChartData(missingData.after)
      };
      updateChart(chartInfo.id, chartData, chartTimeRange);
    }
  }, [data]);

  return (
    <>
      {chartInfo.type == 'data' &&
      <div className="sensor-display" onClick={() => setSelectedSensor(chartInfo.id.at(-1))}>
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
          <div className='sensor-display-data-chart'>
            <canvas id={chartInfo.id}></canvas>
          </div>
        </div>
      </div>}
      {chartInfo.type == 'state' &&
      <div className="sensor-display" onClick={() => setSelectedSensor(chartInfo.id.at(-1))}>
        <div className="sensor-display-head">
          <div>
              {!displayData.state && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                  <path 
                  d="M3 21H21M18 21V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.0799 6 6.2V21M15 12H15.01" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  />
              </svg>}
              {displayData.state && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                  <path 
                  d="M3 21.0001L14 21V5.98924C14 4.6252 14 3.94318 13.7187 3.47045C13.472 3.05596 13.0838 2.74457 12.6257 2.59368C12.1032 2.42159 11.4374 2.56954 10.1058 2.86544L7.50582 3.44322C6.6117 3.64191 6.16464 3.74126 5.83093 3.98167C5.53658 4.19373 5.30545 4.48186 5.1623 4.8152C5 5.19312 5 5.65108 5 6.56702V21.0001M13.994 5.00007H15.8C16.9201 5.00007 17.4802 5.00007 17.908 5.21805C18.2843 5.4098 18.5903 5.71576 18.782 6.09209C19 6.51991 19 7.07996 19 8.20007V21.0001H21M11 12.0001H11.01" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  />
              </svg>}
          </div>
          <div>
            <div className="sensor-display-title">
              <div>{(displayData.state === '-1') ? 'Unknown' : (displayData.state ? chartInfo.info.true : chartInfo.info.false)}</div>
              <div></div>
            </div>
            <div className="sensor-display-subtitle">
              {chartInfo.info.type}
            </div>
          </div>
        </div>
        <div className="sensor-display-body">
          <div className="sensor-display-peaks">
            <div>
              <div>{`Last ${chartInfo.info.dataType}`}</div>
              <div>{(typeof displayData.value === 'boolean') ? (displayData.state ? chartInfo.info.true : chartInfo.info.false) : displayData.value}</div>
            </div>
          </div>
          <div className='sensor-display-state-chart'>
            <canvas id={chartInfo.id}></canvas>
          </div>
        </div>
      </div>}
    </>
  );
}
