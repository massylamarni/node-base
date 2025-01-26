'use client';

import { useState, useEffect } from 'react';
import SensorDisplayData from './components/sensor-display-data';
import SensorDisplayChart from './components/sensor-display-chart';
import SensorSettingSlider from './components/sensor-setting-slider';
import SensorDisplayTable from './components/sensor-display-table';

const TEMPERATURE_INFO = {
  'type': 'Temperature',
  'unit': '°C'
}
const GAS_INFO = {
  'type': 'Gas rate',
  'unit': 'PPM'
}
const RFID_INFO = {
  'type': 'RFID validation',
  'dataType': 'UID',
  'true': 'Valid',
  'false': 'Not valid'
}
const MOVEMENT_INFO = {
  'type': 'Movement state',
  'dataType': 'State',
  'true': 'Movement detected',
  'false': 'No Movement'
}

const CHARTS_INFO = {
  'data': [
    {'id': 'chart-d1', 'type': 'data', 'endpoint': {'name': '/api/get/temperature', 'type': 'GET'}, 'info': TEMPERATURE_INFO},
    {'id': 'chart-d2', 'type': 'data', 'endpoint': {'name': '/api/get/gas', 'type': 'GET'}, 'info': GAS_INFO},
    {'id': 'chart-d3', 'type': 'state', 'endpoint': {'name': '/api/get/rfid', 'type': 'GET'}, 'info': RFID_INFO},
    {'id': 'chart-d4', 'type': 'state', 'endpoint': {'name': '/api/get/movement', 'type': 'GET'}, 'info': MOVEMENT_INFO},
  ],
  'chart': [
    {'id': 'chart-c1', 'type': 'data', 'endpoint': {'name': '/api/get/temperature', 'type': 'GET'}, 'info': TEMPERATURE_INFO},
    {'id': 'chart-c2', 'type': 'data', 'endpoint': {'name': '/api/get/gas', 'type': 'GET'}, 'info': GAS_INFO},
    {'id': 'chart-c3', 'type': 'state', 'endpoint': {'name': '/api/get/rfid', 'type': 'GET'}, 'info': RFID_INFO},
    {'id': 'chart-c4', 'type': 'state', 'endpoint': {'name': '/api/get/movement', 'type': 'GET'}, 'info': MOVEMENT_INFO},
  ]
}

const TABLES_INFO = {
  'data': [
    {'id': 'table-d1', 'type': 'data', 'endpoint': {'name': '/api/get/temperature', 'type': 'GET'}, 'info': TEMPERATURE_INFO},
    {'id': 'table-d2', 'type': 'data', 'endpoint': {'name': '/api/get/gas', 'type': 'GET'}, 'info': GAS_INFO},
    {'id': 'table-d3', 'type': 'state', 'endpoint': {'name': '/api/get/rfid', 'type': 'GET'}, 'info': RFID_INFO},
    {'id': 'table-d4', 'type': 'state', 'endpoint': {'name': '/api/get/movement', 'type': 'GET'}, 'info': MOVEMENT_INFO},
  ],
}

export default function Home() {
  const [refreshRate, setRefreshRate] = useState(30000);
  const [selectedSensor, setSelectedSensor] = useState(CHARTS_INFO.data[0].id.at(-1));
  return (
    <>
      <div className='sensors-display-layout'>
        <div className='main'>
          <div className='sensors-display-grid'>
            <div></div>
            {true && <SensorDisplayData chartInfo={CHARTS_INFO.data[0]} refreshRate={refreshRate} setSelectedSensor={setSelectedSensor} />}
            {true && <SensorDisplayData chartInfo={CHARTS_INFO.data[1]} refreshRate={refreshRate} setSelectedSensor={setSelectedSensor} />}
            {true && <SensorSettingSlider refreshRate={refreshRate} setRefreshRate={setRefreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[0].id.at(-1)) && <SensorDisplayChart chartInfo={CHARTS_INFO.chart[0]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[1].id.at(-1)) && <SensorDisplayChart chartInfo={CHARTS_INFO.chart[1]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[2].id.at(-1)) && <SensorDisplayChart chartInfo={CHARTS_INFO.chart[2]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[3].id.at(-1)) && <SensorDisplayChart chartInfo={CHARTS_INFO.chart[3]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[0].id.at(-1)) && <SensorDisplayTable tableInfo={TABLES_INFO.data[0]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[1].id.at(-1)) && <SensorDisplayTable tableInfo={TABLES_INFO.data[1]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[2].id.at(-1)) && <SensorDisplayTable tableInfo={TABLES_INFO.data[2]} refreshRate={refreshRate} />}
            {(selectedSensor == CHARTS_INFO.data[3].id.at(-1)) && <SensorDisplayTable tableInfo={TABLES_INFO.data[3]} refreshRate={refreshRate} />}
            {true && <SensorDisplayData chartInfo={CHARTS_INFO.data[2]} refreshRate={refreshRate} setSelectedSensor={setSelectedSensor} />}
            {true && <SensorDisplayData chartInfo={CHARTS_INFO.data[3]} refreshRate={refreshRate} setSelectedSensor={setSelectedSensor} />}
          </div>
        </div>
        
      </div>
    </>
  );
}
