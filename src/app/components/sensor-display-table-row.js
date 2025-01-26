import { getDisplayStateData } from '../functions/main';

export default function SensorDisplayTableRow({ tableRowData }) {
  const displayStateData = getDisplayStateData([tableRowData.data], false);
  return (
    <div className="sensor-display-table-row">
      <div className="sensor-display-table-row-head">
        {tableRowData.info.type == 'state' &&
        <>
          <div>
              <div className="sensor-display-table-row-title">
                <div>{displayStateData.state ? tableRowData.info.info.true : tableRowData.info.info.false}</div>
                <div>{tableRowData.info.info.unit}</div>
              </div>
              <div className="sensor-display-table-row-subtitle">
                {tableRowData.info.info.type}
              </div>
          </div>
          <div>
            <div className="sensor-display-table-row-title">
              <div>{typeof displayStateData.value === 'boolean' ? ((displayStateData.value) ? "1.00" : "0.00") : displayStateData.value}</div>
              <div>{tableRowData.info.info.unit}</div>
            </div>
            <div className="sensor-display-table-row-subtitle">
              {tableRowData.info.info.dataType}
            </div>
          </div>
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
            <div>{tableRowData.data.createdAt}</div>
            <div>Recorded at</div>
          </div>
        </div>
      </div>
    </div>
  );
}
