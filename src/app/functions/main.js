export const checkStruct = (data) => {
    return (data && data[0]);
}

export function missingDataSpectrum(sensorData, displayTimeRange) {
    let missingData = [];
    const delay = 5000;
    const defaultMissingData = [
      {"data": "0", "createdAt": new Date(displayTimeRange.start).toString()},
      {"data": "0", "createdAt": new Date(displayTimeRange.end).toString()} 
    ];

    if (!checkStruct(sensorData)) {
      missingData = defaultMissingData;
    } else {
      const dataTime = {"start": new Date(sensorData[0].createdAt), "end": new Date(sensorData[sensorData.length-1].createdAt)};
      if (dataTime.start <= displayTimeRange.start && dataTime.end >= displayTimeRange.end) {
        //Normal behavior
        console.log('-----------------------------------1');
      }
      else if (dataTime.start <= displayTimeRange.start && dataTime.end < displayTimeRange.end) {
        console.log('-----------------------------------2');

        missingData = [
          {"data": sensorData[sensorData.length-1].data, "createdAt": new Date(dataTime.end).toString()},
          {"data": 0, "createdAt": new Date(dataTime.end.getTime()+delay).toString()},
          {"data": 0, "createdAt": new Date(displayTimeRange.end).toString()}
        ];
      }
      else if (dataTime.start > displayTimeRange.start && dataTime.end >= displayTimeRange.end) {
        console.log('-----------------------------------3');

        missingData = [
          {"data": 0, "createdAt": new Date(displayTimeRange.start).toString()},
          {"data": 0, "createdAt": new Date(dataTime.start.getTime()-delay).toString()},
          {"data": sensorData[0].data, "createdAt": new Date(dataTime.start).toString()},
        ];
      }
      else if (dataTime.start > displayTimeRange.start && dataTime.end < displayTimeRange.end) {
        console.log('-----------------------------------4');

        missingData = [
          {"data": 0, "createdAt": new Date(displayTimeRange.start).toString()},
          {"data": 0, "createdAt": new Date(dataTime.start.getTime()-delay).toString()},
          {"data": sensorData[0].data, "createdAt": new Date(dataTime.start).toString()},
          {"data": sensorData[sensorData.length-1].data, "createdAt": new Date(dataTime.end).toString()},
          {"data": 0, "createdAt": new Date(dataTime.end.getTime()+delay).toString()},
          {"data": 0, "createdAt": new Date(displayTimeRange.end).toString()}
        ];
      } else {
        console.log('-----------------------------------5');
        missingData = defaultMissingData;
      }
    }
    return missingData;
  }