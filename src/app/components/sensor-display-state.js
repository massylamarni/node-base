import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function getLastUID(sensorData) {
  const uids = sensorData.filter(entry => entry.data !== '0');
  return uids[uids.length-1] ? uids[uids.length-1].data : "No uids to show";
}

function getDoorState(sensorData) {
  return sensorData[sensorData.length-1].data == '0' ? false : true;
}

export default function SensorDisplayState({ sensorData, stateType }) {
  const chartRef = useRef(null);

  return (
    <div className="sensor-display">
      <div className="sensor-display-head">
        <div>
            {!getDoorState(sensorData) && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                <path 
                d="M3 21H21M18 21V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.0799 6 6.2V21M15 12H15.01" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                />
            </svg>}
            {getDoorState(sensorData) && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
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
            <div>{getDoorState(sensorData) ? "Open" : "Closed"}</div>
            <div></div>
          </div>
          <div className="sensor-display-subtitle">
            {stateType}
          </div>
        </div>
      </div>
      <div className="sensor-display-body">
        <div className="sensor-display-peaks">
          <div>
            <div>Last used uid</div>
            <div>{getLastUID(sensorData)}</div>
          </div>
        </div>
        <canvas className="sensor-display-chart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
