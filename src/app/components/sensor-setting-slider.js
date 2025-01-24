import React from 'react';
import { Range } from 'react-range';

export default function SensorSettingSlider({ refreshRate, setRefreshRate}) {
  const [values, setValues] = React.useState([refreshRate]);
  
  const handleValuesChange = (newValues) => {
    const constraintedNewValues = [Math.min(Math.max(newValues[0], 1000), 60000)];
    setValues(constraintedNewValues);
    setRefreshRate(constraintedNewValues);
  }

  return (
    <div className="sensor-display">
      <div className="sensor-display-head">
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
          <div className="sensor-display-title">
            <div>{"Every " + values[0]/1000 + ((values[0] == 1) ? " Second" : " Seconds")}</div>
            <div></div>
          </div>
          <div className="sensor-display-subtitle">
            {"Sensors refresh rate"}
          </div>
        </div>
      </div>
      <div className="sensor-display-body">
        <Range values={values} step={5000} min={0} max={61000} onChange={newValues => handleValuesChange(newValues)}
          renderTrack={({ props, children }) => {
            const { key, ...trackProps } = props; // destructure to remove the `key`
            const selectedStyle = { width: `calc(${(values[0] / 61000) * 100}% + 10px)` };
            return (
              <div {...trackProps} key="track" className='slider'>
                <div className='slider-selected' style={selectedStyle} key="selected"></div>
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...thumbProps } = props; // destructure to remove the `key`
            return (
              <div {...thumbProps} key="thumb" className='thumb' />
            );
        }} />
      </div>
    </div>
  );
};
