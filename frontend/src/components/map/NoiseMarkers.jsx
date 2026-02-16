import { CircleMarker, Popup } from "react-leaflet";
import { getNoiseColor, getNoiseLevel } from "./utils";

function NoiseMarkers({ noiseData }) {
    return (
        <>
            {noiseData.map((report, index) => (
                <CircleMarker
                    key={index}
                    center={[report.lat, report.long]}
                    radius={8}
                    fillColor={getNoiseColor(report.decibels)}
                    color="#fff"
                    weight={1}
                    opacity={1}
                    fillOpacity={1}
                >
                    <Popup>
                        <div className="noise-popup">
                            <h3 className="noise-popup-header">
                                {report.decibels} dB
                            </h3>
                            <div className="noise-popup-body">
                                <p className="noise-popup-row">
                                    <strong>Level:</strong>
                                    <span
                                        className="noise-popup-level-badge"
                                        style={{
                                            backgroundColor: getNoiseColor(report.decibels) + '30',
                                            color: '#333'
                                        }}
                                    >
                                        {getNoiseLevel(report.decibels)}
                                    </span>
                                </p>
                                {report.category && (
                                    <p className="noise-popup-row">
                                        <strong>Category:</strong>
                                        <span>{report.category}</span>
                                    </p>
                                )}
                                <p className="noise-popup-row time">
                                    <strong>Time:</strong>
                                    <span>{new Date(report.time).toLocaleString()}</span>
                                </p>
                                <p className="noise-popup-coordinates">
                                    {report.lat.toFixed(4)}, {report.long.toFixed(4)}
                                </p>
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </>
    );
}

export default NoiseMarkers;