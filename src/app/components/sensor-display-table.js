import { useEffect, useState, useRef } from 'react';
import SensorDisplayTableRow from './sensor-display-table-row';
import { checkStruct, fetchRawDataArray } from '../functions/main';

function throttleEvents(fn, wait) {
    let lastTime = 0;
    return function (event, ...args) {
        const now = Date.now();
        event.preventDefault();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn(event, ...args);
        }
    };
}
const defaultData = [
    {"data": 'Unknown', 'createdAt': 'Unknown'},
    {"data": 'Unknown', 'createdAt': 'Unknown'},
    {"data": 'Unknown', 'createdAt': 'Unknown'},
    {"data": 'Unknown', 'createdAt': 'Unknown'},
    {"data": 'Unknown', 'createdAt': 'Unknown'},
    {"data": 'Unknown', 'createdAt': 'Unknown'},
]
const rowCount = defaultData.length;

export default function SensorDisplayTable({ tableInfo, refreshRate }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState({'name': 'Last 24 hours', 'value': {'start': 24 * 60 * 60 * 1000, 'end': 0}});
  const getChartTimeRange = () => {
    return {"start": new Date(new Date().getTime() - selectedTimeRange.value.start), "end": new Date(new Date().getTime() - selectedTimeRange.value.end)};
  }
  const [data, setData] = useState(defaultData);
  const [chartTimeRange, setChartTimeRange] = useState(getChartTimeRange());
  const [dataAnchor, setDataAnchor] = useState({'now': rowCount-1, 'max': rowCount-1});
  const tableRef = useRef(null);
  let lastTouchY = 0;

  const updateDataAnchor = (direction) => {
    if (direction == 0) {
        setDataAnchor(prev => (prev.now >= rowCount) ? {...prev, 'now': prev.now - 1} : prev);
    } else {
        setDataAnchor(prev => (prev.now < prev.max) ? {...prev, 'now': prev.now + 1} : prev);
    }
  }

  function handleScroll(event) {
    const tableEl = tableRef.current;
    if (event.deltaY > 0) {         //Scroll down
      updateDataAnchor(0);
    } else if (event.deltaY < 0) {  //Scroll up
      updateDataAnchor(1);
    }
  };

  function handleTouchStart(event) {
    if (event.touches.length === 1) {
        lastTouchY = event.touches[0].clientY;
    }
  }

  function handleTouchMove(event) {
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        const delta = touch.clientY - lastTouchY;
        lastTouchY = touch.clientY;

        if (delta > 0) {            //Scroll down
            updateDataAnchor(1);
        } else if (delta < 0) {     //Scroll up
            updateDataAnchor(0);
        }
    }
  }

  useEffect(() => {
    const tableEl = tableRef.current;
    tableEl.addEventListener('wheel', throttleEvents(handleScroll, 100), { passive: false });
    tableEl.addEventListener('touchstart', throttleEvents(handleTouchStart, 100), { passive: false });
    tableEl.addEventListener('touchmove', throttleEvents(handleTouchMove, 100), { passive: false });
    return () => {
      tableEl.removeEventListener('wheel', throttleEvents(handleScroll, 100));
      tableEl.removeEventListener('touchstart', throttleEvents(handleTouchStart, 100));
      tableEl.removeEventListener('touchmove', throttleEvents(handleTouchMove, 100));
    };
  }, []);

  useEffect(() => {
    setChartTimeRange(getChartTimeRange());
    fetchRawDataArray(tableInfo.endpoint.name, setData, chartTimeRange);
    const intervalId = setInterval(() => {
      setChartTimeRange(getChartTimeRange());
      fetchRawDataArray(tableInfo.endpoint.name, setData, chartTimeRange);
    }, refreshRate);
    return () => clearInterval(intervalId);
  }, [refreshRate, selectedTimeRange]);

  useEffect(() => {
    if (dataAnchor.max == rowCount-1) setDataAnchor({'now': data.length-1, 'max': data.length-1});
  }, [data]);

return (
    <div className="sensor-display-table sensor-display">
      <div className="sensor-display-table-head sensor-display-head">
        <div>
            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                <path
                d="M12 9C11.1077 8.98562 10.2363 9.27003 9.52424 9.808C8.81222 10.346 8.30055 11.1066 8.07061 11.9688C7.84068 12.8311 7.90568 13.7455 8.25529 14.5665C8.6049 15.3876 9.21904 16.0682 10 16.5M12 3V5M6.6 18.4L5.2 19.8M4 13H2M6.6 7.6L5.2 6.2M20 14.5351V4C20 2.89543 19.1046 2 18 2C16.8954 2 16 2.89543 16 4V14.5351C14.8044 15.2267 14 16.5194 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 16.5194 21.1956 15.2267 20 14.5351Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
        </div>
        <div>
          <div className="sensor-display-table-title sensor-display-title">
            <div>{selectedTimeRange.name + ' History'}</div>
            <div></div>
          </div>
          <div className="sensor-display-table-subtitle sensor-display-subtitle">
            {tableInfo.info.type}
          </div>
        </div>
      </div>
      <div className="sensor-display-table-body" ref={tableRef}>
        {checkStruct(data) && <>
          <SensorDisplayTableRow tableRowData={{"data": data[dataAnchor.now], "info": tableInfo}} />
          <SensorDisplayTableRow tableRowData={{"data": data[dataAnchor.now-1], "info": tableInfo}} />
          <SensorDisplayTableRow tableRowData={{"data": data[dataAnchor.now-2], "info": tableInfo}} />
          <SensorDisplayTableRow tableRowData={{"data": data[dataAnchor.now-3], "info": tableInfo}} />
          <SensorDisplayTableRow tableRowData={{"data": data[dataAnchor.now-4], "info": tableInfo}} />
          <SensorDisplayTableRow tableRowData={{"data": data[dataAnchor.now-5], "info": tableInfo}} />
        </>}
      </div>
    </div>
);
}
  