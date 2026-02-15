function NoiseLegend() {
    const levels = [
        { range: "< 40 dB", color: "#4CAF50", label: "Quiet" },
        { range: "40-55 dB", color: "#8BC34A", label: "Moderate" },
        { range: "55-65 dB", color: "#FFEB3B", label: "Noticeable" },
        { range: "65-75 dB", color: "#FF9800", label: "Loud" },
        { range: "75-85 dB", color: "#FF5722", label: "Very Loud" },
        { range: "> 85 dB", color: "#F44336", label: "Extremely Loud" },
    ];

    return (
        <div className="noise-legend">
            <h4>Noise Levels</h4>
            {levels.map((level, index) => (
                <div key={index} className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: level.color }}
                    ></span>
                    <span className="legend-text">
                        {level.range} - {level.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default NoiseLegend;