# Ocean Sentinel

Build this project completely from scratch, without reusing or assuming existing UI/code. Create a lightweight React + Vite + CSS + React Router web app only, using mock data separated from components. Project: “Satellite-Based Oil Spill Detection & Vessel Attribution using AIS Correlation — SIH PS26143”.

Create exactly 5 navigable pages: Overview, Satellite Analysis, Drift Backtracking, AIS Vessel Analysis, and Suspect Ranking. Navigation labels: Overview | Satellite | Backtracking | AIS | Suspects.

Implement a professional dark navy/black satellite and ocean intelligence interface with subtle moving stars, restrained cyan/blue accents, ocean/grid effects, clean typography, minimal realistic panels, and restrained smooth animation. Avoid PPT look, excessive neon/glass, huge cards, charts, login/signup/chatbot/tutorial/how-it-works/weather/notifications/extra pages.

Use SVG/CSS/React mock ocean maps, no real map tiles/downloads/heavy libraries. Main map UIs must genuinely support drag/pan, zoom in/out, clickable markers, selectable vessels, draggable slider, and smooth modal/panel transitions. Every button and control must work; no dead buttons.

1 Overview: main interactive ocean map, active spill summary, probable origin, top suspect vessel.
2 Satellite: large interactive satellite-style map, spill polygon/highlight; show coords 15.234,72.451, area 12.4 km², confidence 94%, age 6–9 hours, detection timestamp, active status; working View Details modal.
3 Backtracking: interactive ocean map, spill point, backtracked drift path, probable origin, draggable time slider that changes rendered path/position.
4 AIS: movable/zoomable map with mock vessel markers and tracks, candidate vessel list; selecting a vessel highlights it and opens its details.
5 Suspects: ranked suspect vessels with suspicion, proximity, temporal, AIS gap and vessel type scores; clicking opens working detail panel/modal.

Mock detection data exactly: id SP-001; latitude 15.234; longitude 72.451; areaKm2 12.4; confidence 94; estimatedAge 6–9 hours; detectedAt 2026-09-04T05:30:00Z; status active. Make small mock drift, vessel, and suspect datasets.

Ensure npm run dev works. Before finishing, verify every route and interaction and check/fix console errors.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://spill-spy-net.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6648da0-3237-44bb-8262-ee92a92191fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
