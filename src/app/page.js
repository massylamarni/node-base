'use client';

import { useState, useEffect } from 'react';
import SensorDisplay from './components/sensor-display';

export default function Home() {
  const [gas, setGas] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [uid, setUid] = useState(null);
  const [time, setTime] = useState(12);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (sensor, setter) => {
      try {
        const response = await fetch(`/api/get/${sensor}?time=${time}`);
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
    }, 1000); // 5000ms = 5 seconds

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <>
      {gas && <SensorDisplay sensorData={gas} sensorType={'Gas rate'} sensorUnit={'M³'} />}
      {temperature && <SensorDisplay sensorData={temperature} sensorType={'Temperature'} sensorUnit={'°C'} />}

    </>
  );
}
