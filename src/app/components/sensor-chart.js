import { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { missingDataSpectrum } from '../functions/main';

const getDisplayTimeRange = () => {
  return {"start": new Date(new Date().getTime() - 1 * 60 * 60 * 1000), "end": new Date(new Date().getTime() - 1 * 1000)};
}

function averageData(data, chunkSize) {
    let avgs = [];
    let chunkSum = 0;
    for (let i = 0; i < data.length; i++) {
        chunkSum = chunkSum + data[i].y;
        if (i%chunkSize === 0) {
            avgs.push({"x": data[i].x, "y": chunkSum/chunkSize});
            chunkSum = 0;
        }  
    }
    if (chunkSum != 0) avgs.push({"x": data[data.length-1].x, "y": chunkSum/chunkSize});
    return avgs;
}

function formatSensorData(sensorData, displayTimeRange) {
    const chartData = sensorData.map(entry => {
      return {"x": new Date(entry.createdAt), "y": entry.data.uid ? (entry.data.is_valid == "1" ? 1 : 0) : parseFloat(entry.data)}
    });
    const maxEntrySize = 15;
    const maxTimeSpan = 1000000;
    const timeSpan = new Date(displayTimeRange.end) - new Date(displayTimeRange.start);
    const timeNonce = timeSpan / 100000;
    const baseChunkSize = 5;
    const chunkSize = (sensorData.length > maxEntrySize && timeSpan > maxTimeSpan) ? Math.floor(timeNonce/baseChunkSize) : 0;
    return chunkSize == 0 ? chartData : averageData(chartData, chunkSize);
}

  

export default function SensorChart({ sensorData, sensorType, sensorUnit }) {
  const chartRef = useRef(null);
  const [displayTimeRange, setDisplayTimeRange] = useState(getDisplayTimeRange());

   useEffect(() => {
     if (chartRef.current) {
       const ctx = chartRef.current.getContext('2d');
       setDisplayTimeRange(getDisplayTimeRange());
       const chartInstance = new Chart(chartRef.current, {
         type: 'line',
         data: {
           datasets: [
             { 
               data: formatSensorData(sensorData, displayTimeRange),
               fill: true,
               tension: 0.5,
               pointRadius: 0,
               borderColor: "rgba(48, 228, 142, 1)",
               backgroundColor: function(context) {
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
                gradient.addColorStop(0.5, 'rgba(48, 228, 142, 0.1)');
                gradient.addColorStop(1, 'rgba(31, 31, 31, 0)');
                return gradient;
               },
             },
             { 
               data: formatSensorData(sensorData, displayTimeRange),
               fill: true,
               tension: 0.5,
               pointRadius: 0,
               borderColor: "rgba(228, 48, 48, 1)",
               backgroundColor: function(context) {
                const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
                gradient.addColorStop(0.5, 'rgba(228, 48, 48, 0.1)');
                gradient.addColorStop(1, 'rgba(31, 31, 31, 0)');
                return gradient;
               },
             },
           ]
         },
         options: {
            layout: {
                padding: {
                    top: 15,
                }
            },
             plugins: {
                 legend: { display: false },
             },
             animation: {
                 duration: 0,
             },
             responsive: true,
             scales: {
                 x: {
                   type: 'time',
                   display: true,
                   grid: {
                     display: false
                   },
                   ticks: {
                     display: true,
                     stepSize: 1
                   },
                   min: displayTimeRange.start,
                   max: displayTimeRange.end
                 },
                 y: {
                   display: true,
                   grid: {
                     display: false
                   },
                   ticks: {
                     display: true
                   },
                   min: 0,
                 }
             }
         }
       });
 
       // Cleanup the chart instance on component unmount or re-render
       return () => {
         if (chartInstance) {
           chartInstance.destroy();
         }
       };
     }
   }, [sensorData]);
 

  return (
    <div className="sensor-chart">
        <div className='sensor-chart-head'>
            <div className='sensor-chart-title'>
                {sensorType}
            </div>
            <div className='sensor-chart-dropdown'>

            </div>
        </div>
        <div className='sensor-chart-body'>
            <canvas className="sensor-chart-chart" ref={chartRef}></canvas>
        </div>
    </div>
  );
}
