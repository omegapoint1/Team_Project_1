import { useRef, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getWeekNumber, getMonday } from "./utils";

function BarChartView({ noiseData, chartMode, setChartMode }) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                console.log('Container dimensions:', width, height);
                setDimensions({ width, height });
            }
        };

        // Initial measurement
        updateDimensions();

        // Measure again after a delay to ensure layout is complete
        const timer = setTimeout(updateDimensions, 100);

        // Listen for window resize
        window.addEventListener('resize', updateDimensions);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    console.log('=== BarChartView Render ===');
    console.log('noiseData:', noiseData);
    console.log('chartMode:', chartMode);
    console.log('dimensions:', dimensions);

    if (!noiseData || noiseData.length === 0) {
        return (
            <div className="bar-chart-container">
                <div className="bar-chart-header">
                    <h2>No Data Available</h2>
                    <p>Please add some noise reports to view the chart</p>
                </div>
            </div>
        );
    }

    // Find date range
    const dates = noiseData.map(report => new Date(report.time));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Reset time to start/end of day
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(23, 59, 59, 999);

    console.log('Date range:', minDate.toLocaleDateString(), 'to', maxDate.toLocaleDateString());

    let chartData = [];

    if (chartMode === 'days') {
        // Generate all days in range
        const currentDate = new Date(minDate);
        const reportsByDay = {};

        // Initialize all days with 0 reports
        while (currentDate <= maxDate) {
            const month = currentDate.toLocaleDateString('en-US', { month: 'short' });
            const day = currentDate.getDate();
            const dateKey = `${month} ${day}`;
            reportsByDay[dateKey] = {
                date: dateKey,
                fullDate: new Date(currentDate),
                reports: 0
            };
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Count reports for each day
        noiseData.forEach(report => {
            const date = new Date(report.time);
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            const dateKey = `${month} ${day}`;
            if (reportsByDay[dateKey]) {
                reportsByDay[dateKey].reports += 1;
            }
        });

        chartData = Object.values(reportsByDay).sort((a, b) => a.fullDate - b.fullDate);
        console.log('Daily chart data:', chartData);
    } else {
        // Weekly mode
        const reportsByWeek = {};

        // Get Monday of first week and last week
        const firstMonday = getMonday(minDate);
        const lastMonday = getMonday(maxDate);

        // Initialize all weeks with 0 reports
        const currentMonday = new Date(firstMonday);
        while (currentMonday <= lastMonday) {
            const weekNum = getWeekNumber(currentMonday);
            const month = currentMonday.toLocaleDateString('en-US', { month: 'short' });
            const day = currentMonday.getDate();
            const weekLabel = `${month} ${day}`;
            const weekKey = `Week ${weekNum}`;

            reportsByWeek[weekKey] = {
                date: weekLabel,
                week: weekKey,
                fullDate: new Date(currentMonday),
                reports: 0
            };
            currentMonday.setDate(currentMonday.getDate() + 7);
        }

        // Count reports for each week
        noiseData.forEach(report => {
            const date = new Date(report.time);
            const monday = getMonday(date);
            const weekNum = getWeekNumber(monday);
            const weekKey = `Week ${weekNum}`;

            if (reportsByWeek[weekKey]) {
                reportsByWeek[weekKey].reports += 1;
            }
        });

        chartData = Object.values(reportsByWeek).sort((a, b) => a.fullDate - b.fullDate);
        console.log('Weekly chart data:', chartData);
    }

    return (
        <div className="bar-chart-container">
            <div className="bar-chart-header">
                <h2>{chartMode === 'days' ? 'Daily' : 'Weekly'} Noise Reports</h2>
                <p>Total Reports: {noiseData.length}</p>
                <div className="chart-mode-toggle">
                    <button
                        type="button"
                        onClick={() => setChartMode('days')}
                        className={`chart-mode-btn ${chartMode === 'days' ? 'active' : ''}`}
                    >
                        Days
                    </button>
                    <button
                        type="button"
                        onClick={() => setChartMode('weeks')}
                        className={`chart-mode-btn ${chartMode === 'weeks' ? 'active' : ''}`}
                    >
                        Weeks
                    </button>
                </div>
            </div>
            <div ref={containerRef} className="bar-chart-content">
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <BarChart
                        width={dimensions.width}
                        height={dimensions.height}
                        data={chartData}
                        margin={{ top: 30, right: 30, left: 60, bottom: 90 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date"
                            angle={-45}
                            textAnchor="end"
                            height={90}
                            style={{ fontSize: '13px', fontWeight: '500' }}
                            tick={{ fill: '#666', dy: 10 }}
                            label={{
                                value: chartMode === 'days' ? 'Date' : 'Week Starting',
                                position: 'insideBottom',
                                offset: -15,
                                style: { fontSize: '14px', fontWeight: '600', fill: '#333' }
                            }}
                        />
                        <YAxis
                            label={{
                                value: 'Number of Reports',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: '14px', fontWeight: '600', fill: '#333' }
                            }}
                            style={{ fontSize: '13px', fontWeight: '500' }}
                            tick={{ fill: '#666' }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '2px solid #2196F3',
                                borderRadius: '8px',
                                padding: '10px'
                            }}
                            labelStyle={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}
                            cursor={{ fill: 'rgba(33, 150, 243, 0.1)' }}
                        />
                        <Bar
                            dataKey="reports"
                            fill="#2196F3"
                            name="Reports"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={120}
                            label={{
                                position: 'top',
                                fill: '#333',
                                fontSize: 13,
                                fontWeight: 'bold'
                            }}
                        />
                    </BarChart>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        Loading chart...
                    </div>
                )}
            </div>
        </div>
    );
}

export default BarChartView;