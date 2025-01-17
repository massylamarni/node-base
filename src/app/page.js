'use client';

import { useState, useEffect } from 'react';
import SensorDisplayData from './components/sensor-display-data';
import SensorDisplayState from './components/sensor-display-state';
import SensorChart from './components/sensor-chart';
import { checkStruct, filterNull, missingDataSpectrum } from './functions/main';

const DATA_TIME_RANGE = {"start": new Date().setHours(0, 0, 0, 0), "end": new Date().getTime()};

export default function Home() {
  const [gas, setGas] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [movement, setMovement] = useState(null);
  const [uid, setUid] = useState(null);
  const [postDelay, setPostDelay] = useState(5000); //ms
  const [chartVisibilityIndex, setChartVisibilityIndex] = useState(-1);
  const [dataTimeRange, setDataTimeRange] = useState(DATA_TIME_RANGE);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (sensor, setter) => {
      try {
        const response = await fetch(`/api/get/${sensor}?timeStart=${dataTimeRange.start}&timeEnd=${dataTimeRange.end}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        const filteredResult = filterNull(result);
        setter(filteredResult ? filteredResult : missingDataSpectrum(filteredResult, dataTimeRange));
      } catch (err) {
        setError(err.message);
      }
    };
    

    // Trigger the API call whenever `time` changes
    fetchData('gas', setGas);
    fetchData('temperature', setTemperature);
    fetchData('rfid', setUid);
    fetchData('movement', setMovement);
    const intervalId = setInterval(() => {
      fetchData('gas', setGas);
      fetchData('temperature', setTemperature);
      fetchData('rfid', setUid);
      fetchData('movement', setMovement);
    }, 10000); // 5000ms = 5 seconds

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [dataTimeRange]);

  return (
    <>
      {true && checkStruct(temperature) && <SensorDisplayData id={0} sensorData={temperature} sensorType={'Temperature'} sensorUnit={'°C'} setChartVisibilityIndex={setChartVisibilityIndex} />}
      {(chartVisibilityIndex == 0) && checkStruct(temperature) && <SensorChart sensorData={temperature} sensorType={'Temperature'} sensorUnit={'°C'} />}
      {true && checkStruct(gas) && <SensorDisplayData id={1} sensorData={gas} sensorType={'Gas rate'} sensorUnit={'M³'} setChartVisibilityIndex={setChartVisibilityIndex} />}
      {(chartVisibilityIndex == 1) && checkStruct(gas) && <SensorChart sensorData={gas} sensorType={'Gas'} sensorUnit={'M³'} />}
      {true && checkStruct(uid) && <SensorDisplayState sensorData={uid} stateType={'Door state'} stateValue={{"true": "Open", "false": "Closed"}} />}
      {(chartVisibilityIndex == 3) && checkStruct(uid) && <SensorChart sensorData={uid} sensorType={'Door state'} sensorUnit={''} />}
      {true && checkStruct(movement) && <SensorDisplayState sensorData={movement} stateType={'Movement'} stateValue={{"true": "Movement detected", "false": "No Movement"}} />}
      {(chartVisibilityIndex == 2) && checkStruct(movement) && <SensorChart sensorData={movement} sensorType={'Movement'} sensorUnit={''} />}
    </>
  );
}
