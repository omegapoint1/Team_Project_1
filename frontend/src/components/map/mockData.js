// Mock data for testing - 45 entries across 15 different dates
export const MOCK_NOISE_DATA = [
    // Feb 1
    { lat: 50.7, long: -3.5, decibels: 45, time: "2024-02-01T10:30:00", category: "Train" },
    { lat: 50.705, long: -3.505, decibels: 72, time: "2024-02-01T14:35:00", category: "Traffic" },
    { lat: 50.695, long: -3.495, decibels: 38, time: "2024-02-01T18:40:00", category: "Music" },

    // Feb 2
    { lat: 50.702, long: -3.508, decibels: 88, time: "2024-02-02T09:45:00", category: "Construction" },
    { lat: 50.698, long: -3.502, decibels: 55, time: "2024-02-02T12:50:00", category: "Crowd" },
    { lat: 50.708, long: -3.498, decibels: 62, time: "2024-02-02T16:55:00", category: "Traffic" },

    // Feb 3
    { lat: 50.697, long: -3.512, decibels: 48, time: "2024-02-03T08:20:00", category: "Music" },
    { lat: 50.703, long: -3.503, decibels: 76, time: "2024-02-03T11:15:00", category: "Train" },
    { lat: 50.710, long: -3.495, decibels: 65, time: "2024-02-03T15:20:00", category: "Traffic" },

    // Feb 4
    { lat: 50.692, long: -3.507, decibels: 42, time: "2024-02-04T07:45:00", category: "Music" },
    { lat: 50.706, long: -3.510, decibels: 91, time: "2024-02-04T13:30:00", category: "Construction" },
    { lat: 50.699, long: -3.493, decibels: 58, time: "2024-02-04T17:15:00", category: "Crowd" },

    // Feb 5
    { lat: 50.704, long: -3.500, decibels: 70, time: "2024-02-05T09:00:00", category: "Traffic" },
    { lat: 50.696, long: -3.505, decibels: 35, time: "2024-02-05T12:30:00", category: "Music" },
    { lat: 50.709, long: -3.502, decibels: 82, time: "2024-02-05T19:45:00", category: "Train" },

    // Feb 6
    { lat: 50.701, long: -3.497, decibels: 67, time: "2024-02-06T08:15:00", category: "Traffic" },
    { lat: 50.707, long: -3.509, decibels: 93, time: "2024-02-06T14:20:00", category: "Construction" },
    { lat: 50.694, long: -3.501, decibels: 51, time: "2024-02-06T18:30:00", category: "Crowd" },

    // Feb 7
    { lat: 50.698, long: -3.496, decibels: 44, time: "2024-02-07T10:10:00", category: "Music" },
    { lat: 50.711, long: -3.504, decibels: 78, time: "2024-02-07T13:45:00", category: "Train" },
    { lat: 50.693, long: -3.511, decibels: 60, time: "2024-02-07T16:20:00", category: "Traffic" },

    // Feb 8
    { lat: 50.705, long: -3.499, decibels: 85, time: "2024-02-08T09:30:00", category: "Construction" },
    { lat: 50.700, long: -3.506, decibels: 49, time: "2024-02-08T12:15:00", category: "Music" },
    { lat: 50.697, long: -3.503, decibels: 73, time: "2024-02-08T17:40:00", category: "Traffic" },

    // Feb 9
    { lat: 50.708, long: -3.494, decibels: 56, time: "2024-02-09T08:50:00", category: "Crowd" },
    { lat: 50.702, long: -3.513, decibels: 81, time: "2024-02-09T11:25:00", category: "Train" },
    { lat: 50.695, long: -3.508, decibels: 39, time: "2024-02-09T15:10:00", category: "Music" },

    // Feb 10
    { lat: 50.712, long: -3.492, decibels: 68, time: "2024-02-10T10:05:00", category: "Traffic" },
    { lat: 50.691, long: -3.514, decibels: 89, time: "2024-02-10T14:35:00", category: "Construction" },
    { lat: 50.703, long: -3.498, decibels: 54, time: "2024-02-10T18:50:00", category: "Crowd" },

    // Feb 11
    { lat: 50.699, long: -3.507, decibels: 47, time: "2024-02-11T09:20:00", category: "Music" },
    { lat: 50.706, long: -3.491, decibels: 75, time: "2024-02-11T13:10:00", category: "Train" },
    { lat: 50.694, long: -3.515, decibels: 63, time: "2024-02-11T16:45:00", category: "Traffic" },

    // Feb 12
    { lat: 50.710, long: -3.500, decibels: 87, time: "2024-02-12T08:30:00", category: "Construction" },
    { lat: 50.696, long: -3.512, decibels: 41, time: "2024-02-12T11:55:00", category: "Music" },
    { lat: 50.704, long: -3.493, decibels: 71, time: "2024-02-12T15:25:00", category: "Traffic" },

    // Feb 13
    { lat: 50.701, long: -3.510, decibels: 59, time: "2024-02-13T10:40:00", category: "Crowd" },
    { lat: 50.708, long: -3.498, decibels: 62, time: "2024-02-13T15:55:00", category: "Traffic" },
    { lat: 50.697, long: -3.512, decibels: 48, time: "2024-02-13T14:20:00", category: "Music" },

    // Feb 14
    { lat: 50.695, long: -3.506, decibels: 77, time: "2024-02-14T09:15:00", category: "Train" },
    { lat: 50.709, long: -3.495, decibels: 52, time: "2024-02-14T12:30:00", category: "Music" },
    { lat: 50.702, long: -3.504, decibels: 84, time: "2024-02-14T16:50:00", category: "Construction" },

    // Feb 15
    { lat: 50.698, long: -3.501, decibels: 66, time: "2024-02-15T08:25:00", category: "Traffic" },
    { lat: 50.705, long: -3.497, decibels: 43, time: "2024-02-15T13:40:00", category: "Music" },
    { lat: 50.693, long: -3.509, decibels: 79, time: "2024-02-15T17:55:00", category: "Train" },
];