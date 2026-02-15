import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Helper function to fix Leaflet resize issues
export function FixLeafletResize() {
    const map = useMap();

    useEffect(() => {
        // Small delay to ensure container is rendered
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [map]);

    return null;
}

// Helper function to get color based on decibel level
export function getNoiseColor(decibels) {
    if (decibels < 40) return "#4CAF50"; // Green - Quiet
    if (decibels < 55) return "#8BC34A"; // Light Green - Moderate
    if (decibels < 65) return "#FFEB3B"; // Yellow - Noticeable
    if (decibels < 75) return "#FF9800"; // Orange - Loud
    if (decibels < 85) return "#FF5722"; // Deep Orange - Very Loud
    return "#F44336"; // Red - Extremely Loud
}

// Helper function to get noise level description
export function getNoiseLevel(decibels) {
    if (decibels < 40) return "Quiet";
    if (decibels < 55) return "Moderate";
    if (decibels < 65) return "Noticeable";
    if (decibels < 75) return "Loud";
    if (decibels < 85) return "Very Loud";
    return "Extremely Loud";
}

// Helper function to get week number
export function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

// Helper function to get Monday of the week
export function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}