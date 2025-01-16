'use client';

import { useState, useEffect } from 'react';
import SensorDisplayData from './components/sensor-display-data';
import SensorDisplayState from './components/sensor-display-state';
import SensorChart from './components/sensor-chart';
import { checkStruct } from './functions/main';

export default function Home() {
  const [gas, setGas] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [uid, setUid] = useState(null);
  const [postDelay, setPostDelay] = useState(5000); //ms
  const [dataTimeRange, setDataTimeRange] = useState({"start": new Date().setHours(0, 0, 0, 0), "end": new Date().getTime()});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (sensor, setter) => {
      try {
        const response = await fetch(`/api/get/${sensor}?timeStart=${dataTimeRange.start}?timeEnd=${dataTimeRange.end}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setter(result);
      } catch (err) {
        setError(err.message);
      }
    };
    

    // Trigger the API call whenever `time` changes
    fetchData('gas', setGas);
    fetchData('temperature', setTemperature);
    fetchData('rfid', setUid);
    const intervalId = setInterval(() => {
      fetchData('gas', setGas);
      fetchData('temperature', setTemperature);
      fetchData('rfid', setUid);
    }, 10000); // 5000ms = 5 seconds

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [dataTimeRange]);

  return (
    <>
      {checkStruct(temperature) && <SensorDisplayData sensorData={temperature} sensorType={'Temperature'} sensorUnit={'°C'} iconNum={0} />}
      {false && checkStruct(temperature) && <SensorChart sensorData={temperature} sensorType={'Temperature'} sensorUnit={'°C'} />}
      {checkStruct(gas) && <SensorDisplayData sensorData={gas} sensorType={'Gas rate'} sensorUnit={'M³'} iconNum={1} />}
      {false && checkStruct(gas) && <SensorChart sensorData={gas} sensorType={'Gas'} sensorUnit={'M³'} />}
      {checkStruct(uid) && <SensorDisplayState sensorData={uid} stateType={'Door state'} />}
    </>
  );
}
