'use client';

import { useState, useEffect } from 'react';
import SensorDisplayData from './components/sensor-display-data';
import SensorDisplayState from './components/sensor-display-state';
import SensorChart from './components/sensor-chart';

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
  'dataType': 'uid',
  'true': 'Valid',
  'false': 'Not valid'
}
const MOVEMENT_INFO = {
  'type': 'Movement state',
  'dataType': 'state',
  'true': 'Movement detected',
  'false': 'No Movement'
}

const CHARTS_INFO = {
  'data': [
    {'id': 'chart-d1', 'endpoint': {'name': '/api/get/temperature', 'type': 'GET'}, 'info': TEMPERATURE_INFO},
    {'id': 'chart-d2', 'endpoint': {'name': '/api/get/gas', 'type': 'GET'}, 'info': GAS_INFO}
  ],
  'state': [
    {'id': 'chart-s1', 'endpoint': {'name': '/api/get/rfid', 'type': 'GET'}, 'info': RFID_INFO},
    {'id': 'chart-s2', 'endpoint': {'name': '/api/get/movement', 'type': 'GET'}, 'info': MOVEMENT_INFO},
  ],
  'chart': [
    {'id': 'chart-c1', 'endpoint': {'name': '/api/get/temperature', 'type': 'GET'}, 'info': TEMPERATURE_INFO},
    {'id': 'chart-c2', 'endpoint': {'name': '/api/get/gas', 'type': 'GET'}, 'info': GAS_INFO},
    {'id': 'chart-c3', 'endpoint': {'name': '/api/get/rfid', 'type': 'GET'}, 'info': RFID_INFO},
    {'id': 'chart-c4', 'endpoint': {'name': '/api/get/movement', 'type': 'GET'}, 'info': MOVEMENT_INFO},
  ]
}

export default function Home() {

  return (
    <>
      {<SensorDisplayData chartInfo={CHARTS_INFO.data[0]} />}
      {<SensorDisplayData chartInfo={CHARTS_INFO.data[1]} />}
      {<SensorDisplayState chartInfo={CHARTS_INFO.state[0]} />}
      {<SensorDisplayState chartInfo={CHARTS_INFO.state[1]} />}
    </>
  );
}
