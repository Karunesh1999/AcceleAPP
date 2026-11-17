# ACCELE Pro Telemetry - Mobile Application

Modern high-fidelity mobile application for **ACCELE Automotive Intelligence & ADAS Radar Systems**, built with:
- **React 19 + TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Shadcn-inspired UI Components** (Button, Badge, Card, Modal, Sheet)
- **Web Audio API** for real-time ADAS Doppler buzzer sound effects
- **Canvas-Confetti** for purchase order dispatch celebrations

---

## 📱 Features & Screens

1. **Splash Screen**
   - High-tech radar sweep animation with concentric rings and Accele geometric emblem.
   - Live telemetry status indicator (*"SYSTEM READY"*).

2. **Onboarding Carousel (3 Interactive Stages)**
   - **Slide 1**: *"Vision beyond the mirror — See every blind spot."* (Night drive ADAS)
   - **Slide 2**: *"Engineered for installers — Install with confidence."* (Bumper radar mount & cross traffic)
   - **Slide 3**: *"30+ Years of innovation — Built to move business."* (RVC180CTD flagship camera)
   - Dynamic progress indicators, skip and next controls.

3. **Home Dashboard**
   - **Live Telemetry Ticker**: Active radar beacon & ISO 9001:2015 certification.
   - **Hero ADAS Spotlight**: Deep dark-mode aesthetic with driver vision imagery.
   - **Hardware Ecosystem**: 4 category tiles (*Cameras & ADAS*, *Accent Lighting*, *Actuators & Relays*, *GPS & Antennas*).
   - **Interactive 180° Radar Simulator**: Switch between **Left Cross-Traffic**, **Clear Ahead**, and **Right Cross-Traffic** with live target bounding boxes, vehicle speed, and audible warning beeps!
   - **Direct Installer Support Banner**.

4. **Live Sensor Cockpit (Camera / ADAS Tab)**
   - Dedicated vehicle camera feeds (*Front Bumper Radar*, *Rear Hitch RVC180CTD*, *Blindspot Aux*).
   - Doppler vector frequency tuning (24.125 GHz, latency < 35ms).
   - Sensitivity switcher (*Low*, *Medium*, *High*) & buzzer tone tester.

5. **Live Hardware Catalog (Products Tab)**
   - Real-time search by model name, SKU, or vehicle fitment.
   - Category filtering pills.
   - Product cards with wholesale dealer pricing, stock counters, and one-tap cart addition.

6. **Product Detail View (RVC180CTD & others)**
   - Interactive tabs:
     - **Overview**: High-res product showcase and key highlights.
     - **Live HUD**: Real-time Doppler hazard simulation.
     - **Specs**: Engineering specifications table (FOV, image sensor, voltage, IP69K wash rating).
     - **Wiring**: 4-Pin mini DIN harness pinout guide with wire loop cut instructions.
   - Sticky bottom ordering bar with dealer tier pricing and quick add-to-order.

7. **Dealer Manifest & Cart (Sheet Drawer)**
   - Line items with quantity adjustments.
   - Wholesale Tier 1 discount calculation (10% off).
   - Free Freight Logistics threshold indicator ($200+).
   - Purchase order dispatch button with **confetti burst** and generated PO number.

8. **Bay Support & Live Tech Desk**
   - Live interactive technician chat with automated answers to bay questions (*"Where is the reverse wire?"*, *"How to remove parking guidelines?"*).
   - PDF wiring diagrams and fitment guides.
   - Direct dialer to **1-800-988-8089**.

9. **Device Frame & Responsive Mode**
   - Toggle between **Mobile Device Frame** (iPhone 16 Pro Max style with Dynamic Island and status bar) and **Full Screen Mode**.
   - Live audio toggle for ADAS warning beeps.

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```
Local Dev URL: `http://localhost:5173/`
