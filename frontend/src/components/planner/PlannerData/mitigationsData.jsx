export const interventionsData = [
    {
        id: 1,
        name: "Quiet zone signage",
        category: "awareness",
        description: "Install signs indicating designated quiet zones to raise community awareness.",
        costRange: { min: 500, max: 1000 },
        feasibility: 0.9,
        impactRange: { min: 2, max: 4 },
        implementationTime: "1-2 weeks",
    },
    {
        id: 2,
        name: "Time restrictions",
        category: "regulatory",
        description: "Implement time-based noise restrictions for specific activities.",
        costBand: "low",
        costRange: { min: 200, max: 500 },
        feasibility: 0.8,
        impactRange: { min: 3, max: 6 },
        implementationTime: "2-4 weeks",
        maintenance: "Monitoring and enforcement"
    },
    {
        id: 3,
        name: "Noise barriers",
        category: "physical",
        description: "Install physical barriers to block or absorb noise from sources.",
        costBand: "high",
        costRange: { min: 4000, max: 8000 },
        feasibility: 0.6,
        impactRange: { min: 8, max: 12 },
        implementationTime: "4-8 weeks",
        maintenance: "Annual maintenance"
    },
    {
        id: 4,
        name: "Community awareness program",
        category: "education",
        description: "Educational campaign about noise pollution and mitigation.",
        costBand: "medium",
        costRange: { min: 1000, max: 3000 },
        feasibility: 0.85,
        impactRange: { min: 1, max: 3 },
        implementationTime: "3-6 weeks"
    },
    {
        id: 5,
        name: "Equipment upgrades",
        category: "technical",
        description: "Upgrade noisy equipment with quieter alternatives.",
        costBand: "high",
        costRange: { min: 5000, max: 15000 },
        feasibility: 0.5,
        impactRange: { min: 10, max: 15 },
        implementationTime: "8-12 weeks"
    },
    {
        id: 6,
        name: "Green barriers",
        category: "environmental",
        description: "Plant trees and shrubs as natural noise buffers.",
        costBand: "medium",
        costRange: { min: 1500, max: 4000 },
        feasibility: 0.7,
        impactRange: { min: 4, max: 7 },
        implementationTime: "6-12 months",
        maintenance: "Regular gardening"
    }
];

export const zones = [
    { id: "zone_a", name: "Zone A", type: "residential", priority: "high" },
    { id: "zone_b", name: "Zone B", type: "campus", priority: "medium" },
    { id: "zone_c", name: "Zone C", type: "commercial", priority: "low" },
    { id: "zone_d", name: "Zone D", type: "mixed", priority: "medium" }
];