export type Detection = {
  id: string;
  latitude: number;
  longitude: number;
  areaKm2: number;
  confidence: number;
  estimatedAge: string;
  detectedAt: string;
  status: string;
};

export const detection: Detection = {
  id: "SP-001",
  latitude: 15.234,
  longitude: 72.451,
  areaKm2: 12.4,
  confidence: 94,
  estimatedAge: "6–9 hours",
  detectedAt: "2026-09-04T05:30:00Z",
  status: "active",
};

/** Spill outline in geo coords (lon, lat) */
export const spillPolygon: [number, number][] = [
  [72.408, 15.268],
  [72.441, 15.281],
  [72.478, 15.272],
  [72.499, 15.246],
  [72.487, 15.213],
  [72.452, 15.196],
  [72.418, 15.206],
  [72.399, 15.236],
];

export type DriftPoint = {
  hoursAgo: number;
  lat: number;
  lon: number;
  label: string;
};

/** Backtracked drift path: index 0 = current spill centroid */
export const driftPath: DriftPoint[] = [
  { hoursAgo: 0, lat: 15.234, lon: 72.451, label: "Detected slick centroid" },
  { hoursAgo: 1, lat: 15.246, lon: 72.472, label: "Drift −1h" },
  { hoursAgo: 2, lat: 15.259, lon: 72.494, label: "Drift −2h" },
  { hoursAgo: 3, lat: 15.271, lon: 72.518, label: "Drift −3h" },
  { hoursAgo: 4, lat: 15.28, lon: 72.544, label: "Drift −4h" },
  { hoursAgo: 5, lat: 15.288, lon: 72.571, label: "Drift −5h" },
  { hoursAgo: 6, lat: 15.294, lon: 72.598, label: "Drift −6h" },
  { hoursAgo: 7, lat: 15.301, lon: 72.624, label: "Drift −7h" },
  { hoursAgo: 8, lat: 15.309, lon: 72.649, label: "Drift −8h" },
  { hoursAgo: 9, lat: 15.318, lon: 72.673, label: "Probable origin" },
];

export const probableOrigin = {
  lat: 15.318,
  lon: 72.673,
  windowStart: "2026-09-03T20:30:00Z",
  windowEnd: "2026-09-03T23:30:00Z",
  radiusKm: 3.2,
};

export type Vessel = {
  id: string;
  name: string;
  mmsi: string;
  type: string;
  flag: string;
  speedKn: number;
  headingDeg: number;
  lastSeen: string;
  aisGapMin: number;
  track: [number, number][]; // [lon, lat]
};

export const vessels: Vessel[] = [
  {
    id: "V-1",
    name: "MT Kaveri Star",
    mmsi: "419008472",
    type: "Crude oil tanker",
    flag: "India",
    speedKn: 11.4,
    headingDeg: 248,
    lastSeen: "2026-09-04T05:05:00Z",
    aisGapMin: 96,
    track: [
      [72.741, 15.372],
      [72.702, 15.351],
      [72.668, 15.332],
      [72.63, 15.309],
      [72.588, 15.29],
      [72.541, 15.271],
    ],
  },
  {
    id: "V-2",
    name: "Ocean Meridian",
    mmsi: "563114900",
    type: "Bulk carrier",
    flag: "Singapore",
    speedKn: 13.1,
    headingDeg: 202,
    lastSeen: "2026-09-04T05:28:00Z",
    aisGapMin: 12,
    track: [
      [72.512, 15.451],
      [72.505, 15.409],
      [72.498, 15.366],
      [72.492, 15.322],
      [72.487, 15.281],
    ],
  },
  {
    id: "V-3",
    name: "Al Nahda II",
    mmsi: "470221830",
    type: "Product tanker",
    flag: "UAE",
    speedKn: 9.6,
    headingDeg: 271,
    lastSeen: "2026-09-04T04:41:00Z",
    aisGapMin: 58,
    track: [
      [72.309, 15.148],
      [72.352, 15.161],
      [72.398, 15.172],
      [72.444, 15.181],
      [72.489, 15.19],
    ],
  },
  {
    id: "V-4",
    name: "Sagar Pravah",
    mmsi: "419770021",
    type: "Fishing trawler",
    flag: "India",
    speedKn: 4.2,
    headingDeg: 61,
    lastSeen: "2026-09-04T05:30:00Z",
    aisGapMin: 0,
    track: [
      [72.348, 15.302],
      [72.372, 15.312],
      [72.397, 15.318],
      [72.421, 15.327],
    ],
  },
  {
    id: "V-5",
    name: "Pacific Harrier",
    mmsi: "352998117",
    type: "Container ship",
    flag: "Panama",
    speedKn: 16.8,
    headingDeg: 154,
    lastSeen: "2026-09-04T05:22:00Z",
    aisGapMin: 4,
    track: [
      [72.601, 15.061],
      [72.634, 15.09],
      [72.664, 15.121],
      [72.693, 15.152],
    ],
  },
];

export type Suspect = {
  vesselId: string;
  rank: number;
  suspicion: number;
  proximity: number;
  temporal: number;
  aisGap: number;
  vesselType: number;
  summary: string;
};

export const suspects: Suspect[] = [
  {
    vesselId: "V-1",
    rank: 1,
    suspicion: 92,
    proximity: 96,
    temporal: 93,
    aisGap: 88,
    vesselType: 90,
    summary:
      "Transited the backtracked origin cell inside the estimated release window, then reported a 96-minute AIS gap before resuming a reduced-speed course.",
  },
  {
    vesselId: "V-3",
    rank: 2,
    suspicion: 74,
    proximity: 71,
    temporal: 66,
    aisGap: 79,
    vesselType: 84,
    summary:
      "Product tanker passing 8.6 km south of the origin cell with a 58-minute reporting gap partially overlapping the release window.",
  },
  {
    vesselId: "V-2",
    rank: 3,
    suspicion: 47,
    proximity: 58,
    temporal: 51,
    aisGap: 22,
    vesselType: 44,
    summary:
      "Continuous AIS coverage and a north-south transit that only clips the outer drift envelope late in the window.",
  },
  {
    vesselId: "V-5",
    rank: 4,
    suspicion: 28,
    proximity: 24,
    temporal: 33,
    aisGap: 15,
    vesselType: 36,
    summary: "High-speed container transit well east of the origin cell, no meaningful reporting gap.",
  },
  {
    vesselId: "V-4",
    rank: 5,
    suspicion: 12,
    proximity: 30,
    temporal: 14,
    aisGap: 2,
    vesselType: 6,
    summary: "Small trawler operating inshore, uninterrupted AIS and no discharge-capable cargo.",
  },
];

export const vesselById = (id: string) => vessels.find((v) => v.id === id)!;

export function formatUtc(iso: string) {
  const d = new Date(iso);
  return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)} UTC`;
}
