import L from "leaflet";

function VisualizationControls({ visualizationMode, setVisualizationMode, showControls }) {
    if (!showControls) return null;

    const isHeatmapAvailable = typeof L !== 'undefined' && typeof L.heatLayer !== 'undefined';

    const handlePointsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisualizationMode('points');
    };

    const handleHeatmapClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isHeatmapAvailable) {
            alert('Heatmap requires leaflet.heat library.\n\nInstall with: npm install leaflet.heat');
            return;
        }
        setVisualizationMode('heatmap');
    };

    const handleBarGraphClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisualizationMode('bar_graph');
    };

    return (
        <div className="map-controls-right">
            <div className="map-control-group vertical">
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={handlePointsClick}
                        className={`map-control-btn ${visualizationMode === 'points' ? 'active' : ''}`}
                    >
                        Points
                    </button>
                    <button
                        type="button"
                        onClick={handleHeatmapClick}
                        className={`map-control-btn ${visualizationMode === 'heatmap' ? 'active' : ''} ${!isHeatmapAvailable ? 'disabled' : ''}`}
                    >
                        Heatmap
                    </button>
                    <button
                        type="button"
                        onClick={handleBarGraphClick}
                        className={`map-control-btn ${visualizationMode === 'bar_graph' ? 'active' : ''}`}
                    >
                        Bar Graph
                    </button>
                </div>
                {!isHeatmapAvailable && (
                    <div className="map-control-warning">
                        Install leaflet.heat for heatmap
                    </div>
                )}
            </div>
        </div>
    );
}

export default VisualizationControls;