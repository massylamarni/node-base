import { getDisplayStateData } from '../functions/main';

export default function SensorDisplayTableRow({ tableRowData }) {
  const displayStateData = getDisplayStateData([tableRowData.data], false);
  console.log(tableRowData);
  console.log(displayStateData);
  return (
    <div className="sensor-display-table-row">
      <div className="sensor-display-table-row-head">
        {tableRowData.info.type == 'state' &&
        <>
          <div>
              <div className="sensor-display-table-row-title">
                <div>{(displayStateData.state === '-1') ? 'Unknown' : (displayStateData.state ? tableRowData.info.info.true : tableRowData.info.info.false)}</div>
                <div>{tableRowData.info.info.unit}</div>
              </div>
              <div className="sensor-display-table-row-subtitle">
                {tableRowData.info.info.type}
              </div>
          </div>
            {(typeof displayStateData.value !== 'boolean') && (displayStateData.value !== 'Unknown') &&
            <div>
              <div className="sensor-display-table-row-title">
                <div>{displayStateData.value}</div>
                <div>{tableRowData.info.info.unit}</div>
              </div>
              <div className="sensor-display-table-row-subtitle">
                {tableRowData.info.info.dataType}
              </div>
            </div>}
        </>}
        {tableRowData.info.type == 'data' && 
          <div>
            <div className="sensor-display-table-row-title">
              <div>{tableRowData.data.data}</div>
              <div>{tableRowData.info.info.unit}</div>
            </div>
            <div className="sensor-display-table-row-subtitle">
              {tableRowData.info.info.type}
            </div>
          </div>}
      </div>
      <div className="sensor-display-table-row-body">
        <div className="sensor-display-table-row-peaks">
          <div>
            <div>{new Date(tableRowData.data.createdAt).toLocaleString()}</div>
            <div>Recorded at</div>
          </div>
        </div>
      </div>
    </div>
  );
}
