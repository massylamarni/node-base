export default function SensorDisplayTableRow({ tableRowData }) {
  console.log(tableRowData.data)
  return (
    <div className="sensor-display-table-row">
      <div className="sensor-display-table-row-head">
        {tableRowData.info.type == 'state' &&
        <>
          <div>
              <div className="sensor-display-table-row-title">
                <div>{tableRowData.data.state ? tableRowData.info.info.true : tableRowData.info.info.false}</div>
                <div>{tableRowData.info.info.unit}</div>
              </div>
              <div className="sensor-display-table-row-subtitle">
                {tableRowData.info.info.type}
              </div>
          </div>
          <div>
            <div className="sensor-display-table-row-title">
              <div>{tableRowData.data.data}</div>
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
