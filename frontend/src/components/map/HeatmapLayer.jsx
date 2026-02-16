import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

function HeatmapLayer({ noiseData }) {
    const map = useMap();
    const heatLayerRef = useRef(null);

    useEffect(() => {
        if (!map || noiseData.length === 0) return;

        console.log('HeatmapLayer: Attempting to create heatmap with', noiseData.length, 'data points');
        console.log('L.heatLayer available?', typeof L.heatLayer);

        // Check if leaflet.heat is available
        if (typeof L.heatLayer === 'undefined') {
            console.error('L.heatLayer is undefined - leaflet.heat not loaded properly');
            alert('Heatmap library failed to load. Try: npm uninstall leaflet.heat && npm install leaflet.heat');
            return;
        }

        // Remove existing heat layer if it exists
        if (heatLayerRef.current) {
            console.log('Removing existing heat layer');
            map.removeLayer(heatLayerRef.current);
            heatLayerRef.current = null;
        }

        // Convert noise data to heat layer format: [lat, lng, intensity]
        const heatData = noiseData.map(report => {
            const intensity = Math.min(Math.max((report.decibels - 30) / 70, 0), 1);
            return [report.lat, report.long, intensity];
        });

        console.log('HeatmapLayer: Creating heatmap with data:', heatData);

        // Create and add heat layer
        try {
            heatLayerRef.current = L.heatLayer(heatData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                max: 1.0,
                minOpacity: 0.5,
                gradient: {
                    0.0: '#4CAF50',
                    0.2: '#8BC34A',
                    0.4: '#FFEB3B',
                    0.6: '#FF9800',
                    0.8: '#FF5722',
                    1.0: '#F44336'
                }
            }).addTo(map);

            console.log('HeatmapLayer: Successfully added to map');
        } catch (error) {
            console.error('Error creating heatmap:', error);
            alert('Error creating heatmap: ' + error.message);
        }

        return () => {
            if (heatLayerRef.current && map) {
                console.log('Cleaning up heat layer');
                map.removeLayer(heatLayerRef.current);
            }
        };
    }, [map, noiseData]);

    return null;
}

export default HeatmapLayer;