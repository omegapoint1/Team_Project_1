import { MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./MapModule.css";

import { FixLeafletResize } from "./utils";
import { MOCK_NOISE_DATA } from "./mockData";
import NoiseMarkers from "./NoiseMarkers";
import HeatmapLayer from "./HeatmapLayer";
import ZoneBoundaries from "./ZoneBoundaries";
import NoiseLegend from "./NoiseLegend";
import BarChartView from "./BarChartView";
import VisualizationControls from "./VisualizationControls";
import React, { useMemo, useEffect } from "react";

// Main MapModule component
function MapModule({
    center = [50.7, -3.5],
    zoom = 13,
    noiseData = null,
    visualizationMode: propVisualizationMode = 'points',
    showLegend = true,
    showControls = true
}) {
    const [reports_data, setReports] = useState([]);
    
    useEffect(() => {
        const getReports = async () => {
          try {
            const map_data_response = await fetch("/api/map-data/get", {
              method: "GET",
            });
            const mapData = await map_data_response.json();

            const map_data_decoded = mapData.map((map_data, index) => ({
              lat: map_data.lat,
              long: map_data.long,
              decibels: (map_data.noise * 10),
              time: map_data.time,
              category: map_data.category
            }));  
            console.log(map_data_decoded)

            setReports(map_data_decoded);
          } catch (error) {
            console.error("Error fetching reports:", error);
          }
        };
        getReports();
      }, []);

    noiseData = reports_data;

    // Internal state for toggles (only used if showControls is true)
    const [internalVisualizationMode, setInternalVisualizationMode] = useState('points');
    const [chartMode, setChartMode] = useState('days'); // 'days' or 'weeks'

    // Determine which visualization mode to use
    const activeVisualizationMode = showControls ? internalVisualizationMode : propVisualizationMode;

    // Use provided data or fall back to mock data
    const activeNoiseData = noiseData || MOCK_NOISE_DATA;
    const hasNoiseData = activeNoiseData && Array.isArray(activeNoiseData) && activeNoiseData.length > 0;

    console.log('MapModule render - activeVisualizationMode:', activeVisualizationMode);
    console.log('MapModule render - hasNoiseData:', hasNoiseData);
    console.log('MapModule render - activeNoiseData length:', activeNoiseData?.length);

    return (
        <div className="map-background-wrapper">
            {activeVisualizationMode === 'bar_graph' ? (
                /* Show Bar Chart */
                <BarChartView
                    noiseData={hasNoiseData ? activeNoiseData : []}
                    chartMode={chartMode}
                    setChartMode={setChartMode}
                />
            ) : (
                /* Show Map */
                <MapContainer
                    className="leafletMap"
                    center={center}
                    zoom={zoom}
                    zoomControl={true}
                    scrollWheelZoom={true}
                >
                    <FixLeafletResize />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    {/* Conditionally render noise visualization if data is provided */}
                    {hasNoiseData && (
                        <>
                            {activeVisualizationMode === 'points' ? (
                                <NoiseMarkers noiseData={activeNoiseData} />
                            ) : (
                                <HeatmapLayer noiseData={activeNoiseData} />
                            )}
                            {activeVisualizationMode === 'points' && showLegend && <NoiseLegend />}
                        </>
                    )}

                    {/* Always show zone boundaries */}
                    <ZoneBoundaries />
                </MapContainer>
            )}

            {/* Visualization Toggle Controls - in top-right */}
            <VisualizationControls
                visualizationMode={internalVisualizationMode}
                setVisualizationMode={setInternalVisualizationMode}
                showControls={showControls}
            />
        </div>
    );
}

export default MapModule;