import { Polygon } from "react-leaflet";

function ZoneBoundaries() {
    // Define 16 zones in a 4x4 grid covering Exeter
    const zones = [
        // Row 1 (Northmost)
        { id: 1, name: "North-West", bounds: [[50.74, -3.58], [50.74, -3.52], [50.72, -3.52], [50.72, -3.58]] },
        { id: 2, name: "North-Central-West", bounds: [[50.74, -3.52], [50.74, -3.49], [50.72, -3.49], [50.72, -3.52]] },
        { id: 3, name: "North-Central-East", bounds: [[50.74, -3.49], [50.74, -3.46], [50.72, -3.46], [50.72, -3.49]] },
        { id: 4, name: "North-East", bounds: [[50.74, -3.46], [50.74, -3.40], [50.72, -3.40], [50.72, -3.46]] },

        // Row 2
        { id: 5, name: "Central-North-West", bounds: [[50.72, -3.58], [50.72, -3.52], [50.70, -3.52], [50.70, -3.58]] },
        { id: 6, name: "Central-North-Central-West", bounds: [[50.72, -3.52], [50.72, -3.49], [50.70, -3.49], [50.70, -3.52]] },
        { id: 7, name: "Central-North-Central-East", bounds: [[50.72, -3.49], [50.72, -3.46], [50.70, -3.46], [50.70, -3.49]] },
        { id: 8, name: "Central-North-East", bounds: [[50.72, -3.46], [50.72, -3.40], [50.70, -3.40], [50.70, -3.46]] },

        // Row 3
        { id: 9, name: "Central-South-West", bounds: [[50.70, -3.58], [50.70, -3.52], [50.68, -3.52], [50.68, -3.58]] },
        { id: 10, name: "Central-South-Central-West", bounds: [[50.70, -3.52], [50.70, -3.49], [50.68, -3.49], [50.68, -3.52]] },
        { id: 11, name: "Central-South-Central-East", bounds: [[50.70, -3.49], [50.70, -3.46], [50.68, -3.46], [50.68, -3.49]] },
        { id: 12, name: "Central-South-East", bounds: [[50.70, -3.46], [50.70, -3.40], [50.68, -3.40], [50.68, -3.46]] },

        // Row 4 (Southmost)
        { id: 13, name: "South-West", bounds: [[50.68, -3.58], [50.68, -3.52], [50.66, -3.52], [50.66, -3.58]] },
        { id: 14, name: "South-Central-West", bounds: [[50.68, -3.52], [50.68, -3.49], [50.66, -3.49], [50.66, -3.52]] },
        { id: 15, name: "South-Central-East", bounds: [[50.68, -3.49], [50.68, -3.46], [50.66, -3.46], [50.66, -3.49]] },
        { id: 16, name: "South-East", bounds: [[50.68, -3.46], [50.68, -3.40], [50.66, -3.40], [50.66, -3.46]] },
    ];

    return (
        <>
            {zones.map((zone) => (
                <Polygon
                    key={zone.id}
                    positions={zone.bounds}
                    pathOptions={{
                        color: '#000',
                        weight: 2,
                        fillOpacity: 0,
                        opacity: 0.8
                    }}
                    interactive={false}
                />
            ))}
        </>
    );
}

export default ZoneBoundaries;