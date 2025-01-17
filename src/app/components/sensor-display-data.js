import { useEffect, useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { missingDataSpectrum } from '../functions/main';

const DISPLAY_TIME_RANGE = {"start": new Date((new Date().getTime() - 1 * 60 * 1000)), "end": new Date().getTime()};

function getPeakSensorValue(peak, sensorData) {
    let max = sensorData[sensorData.length].data, min = sensorData[sensorData.length].data;
    for (let i = 0; i < sensorData.length; i++) {
        if (sensorData[i].data < min) {
            min = sensorData[i].data;
        }
        if (sensorData[i].data > max) {
            max = sensorData[i].data;
        }
    }
    return (peak == 0) ? min : max;
}

function formatSensorData(sensorData) {
    const chartData = sensorData.map(entry => {
      return {"x": new Date(entry.createdAt), "y": parseFloat(entry.data)}
    });
    return chartData;
}

export default function SensorDisplayData({ id, sensorData, sensorType, sensorUnit, setChartVisibilityIndex }) {
  const chartRef = useRef(null);
  const [displayTimeRange, setDisplayTimeRange] = useState(DISPLAY_TIME_RANGE);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      setDisplayTimeRange(DISPLAY_TIME_RANGE);
      const chartInstance = new Chart(chartRef.current, {
        type: 'line',
        data: {
          datasets: [
            { 
              data: formatSensorData(sensorData),
              fill: false,
              tension: 0.5,
              pointRadius: 0,
              borderColor: function(context) {
                const gradient = ctx.createLinearGradient(0, 0, context.chart.width, 0);
                gradient.addColorStop(0, 'rgba(31, 31, 31, 0)'); // Solid color at the start
                gradient.addColorStop(0.5, 'rgba(48, 228, 142, 1)'); // Start fading at 20%
                gradient.addColorStop(1, 'rgba(31, 31, 31, 0)'); // Solid color at the end
                return gradient;
              },
            },
            { 
              data: formatSensorData(missingDataSpectrum(sensorData, displayTimeRange)),
              fill: false,
              tension: 0.5,
              pointRadius: 0,
              borderColor: function(context) {
                const gradient = ctx.createLinearGradient(0, 0, context.chart.width, 0);
                gradient.addColorStop(0, 'rgba(31, 31, 31, 0)'); // Solid color at the start
                gradient.addColorStop(0.5, 'rgb(228, 48, 48)'); // Start fading at 20%
                gradient.addColorStop(1, 'rgba(31, 31, 31, 0)'); // Solid color at the end
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
                  display: false, // Remove X-axis labels
                  grid: {
                    display: false // Remove grid lines for X-axis
                  },
                  ticks: {
                    display: false // Remove ticks (numbers) on X-axis
                  },
                  min: displayTimeRange.start,
                  max: displayTimeRange.end
                },
                y: {
                  display: false, // Remove Y-axis labels
                  grid: {
                    display: false // Remove grid lines for Y-axis
                  },
                  ticks: {
                    display: false // Remove ticks (numbers) on Y-axis
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
    <div className="sensor-display" onClick={() => setChartVisibilityIndex((prev) => {return (prev == id) ? -1 : id})}>
      <div className="sensor-display-head">
        <div>
            {id == 0 && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                <path
                d="M12 9C11.1077 8.98562 10.2363 9.27003 9.52424 9.808C8.81222 10.346 8.30055 11.1066 8.07061 11.9688C7.84068 12.8311 7.90568 13.7455 8.25529 14.5665C8.6049 15.3876 9.21904 16.0682 10 16.5M12 3V5M6.6 18.4L5.2 19.8M4 13H2M6.6 7.6L5.2 6.2M20 14.5351V4C20 2.89543 19.1046 2 18 2C16.8954 2 16 2.89543 16 4V14.5351C14.8044 15.2267 14 16.5194 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 16.5194 21.1956 15.2267 20 14.5351Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>}
            {id == 1 && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
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
            {id == 2 && <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
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
            <div>{sensorData && sensorData[sensorData.length-1].data}</div>
            <div>{sensorUnit}</div>
          </div>
          <div className="sensor-display-subtitle">
            {sensorType}
          </div>
        </div>
      </div>
      <div className="sensor-display-body">
        <div className="sensor-display-peaks">
          <div>
            <div>Max today</div>
            <div>{getPeakSensorValue(1, sensorData)}</div>
          </div>
          <div>
            <div>Min today</div>
            <div>{getPeakSensorValue(0, sensorData)}</div>
          </div>
        </div>
        <canvas className="sensor-display-chart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
