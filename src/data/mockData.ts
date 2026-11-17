import nightDrive from '@/assets/night-drive.jpg';
import rvcProduct from '@/assets/rvc180-product.png';
import rvcScene from '@/assets/rvc180-scene.png';
import type { Category, Product } from '@/types';

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    eyebrow: "VISION BEYOND THE MIRROR",
    title: "See every blind spot.",
    highlightWord: "blind spot.",
    highlightColor: "#22c7f3",
    text: "180° smart camera radar coverage detects movement before it enters your vehicle's path. Complete situational awareness for fleet & consumer vehicles.",
    image: nightDrive,
    icon: "radar",
    metric: "180° FIELD OF VIEW",
    badge: "ACTIVE RADAR",
  },
  {
    id: 2,
    eyebrow: "ENGINEERED FOR INSTALLERS",
    title: "Install with confidence.",
    highlightWord: "confidence.",
    highlightColor: "#ff3347",
    text: "Vehicle-specific wiring guides, quick pinouts, and on-demand certified technician support right from the service bay.",
    image: rvcScene,
    icon: "wiring",
    metric: "PLUG & PLAY HARNESS",
    badge: "PRO BAY READY",
  },
  {
    id: 3,
    eyebrow: "30+ YEARS OF INNOVATION",
    title: "Built to move business.",
    highlightWord: "business.",
    highlightColor: "#ffc21c",
    text: "Explore pro-grade 12V automotive electronics, live inventory levels, dealer pricing, and instant RMA support in one unified app.",
    image: rvcProduct,
    icon: "shield",
    metric: "ISO 9001:2015",
    badge: "DEALER PORTAL",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "cameras",
    title: "Cameras & ADAS",
    count: "18 systems",
    color: "#ff3347",
    icon: "Camera",
    description: "Backup, 360 surround, front radar and blindspot detection",
  },
  {
    id: "lighting",
    title: "Accent Lighting",
    count: "24 products",
    color: "#22c7f3",
    icon: "Zap",
    description: "RGB interior footwell, underglow, and pro ambient fibre kits",
  },
  {
    id: "wiring",
    title: "Actuators & Relays",
    count: "35 parts",
    color: "#ffc21c",
    icon: "Cpu",
    description: "Heavy duty door actuators, programmable relays, and harnesses",
  },
  {
    id: "gps",
    title: "GPS & Antennas",
    count: "12 items",
    color: "#6f7cff",
    icon: "Radio",
    description: "High-gain amplified telematics, marine and commercial GPS",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "rvc180ctd",
    name: "RVC180CTD Moving Object Recognition Backup Camera",
    sku: "RVC180CTD",
    price: 189.00,
    originalPrice: 229.00,
    category: "cameras",
    tag: "FLAGSHIP ADAS",
    image: rvcProduct,
    rating: 4.9,
    reviewsCount: 128,
    inStock: true,
    stockCount: 42,
    voltage: "9V–16V DC",
    fieldOfView: "180° Radar Vector",
    environmentalRating: "IP69K High Pressure",
    isFlagship: true,
    description: "The Accele RVC180CTD is our flagship moving object recognition camera system. It combines an ultra-wide 160° optical CMOS feed with a wide 180° active radar detection vector. When vehicles, cyclists, or pedestrians approach from the sides, dynamic bounding boxes appear on screen alongside audible multi-frequency warning beeps.",
    highlights: [
      "180° Active Radar Detection Cone",
      "Visual dynamic HUD bounding box on moving targets",
      "Multi-tone buzzer alert for in-cabin feedback",
      "IP69K waterproof aircraft aluminum casing",
      "Selectable parking guidelines (on/off)",
      "Standard RCA or 4-pin commercial DIN connection"
    ],
    specs: {
      "Effective FOV": "180° Radar Vector / 160° Optical Display",
      "Image Sensor": "1/3\" High Sensitivity Starlight CMOS",
      "Display Output": "NTSC / AHD 1080P selectable",
      "Operating Voltage": "9V – 16V DC Reverse Triggered",
      "Current Consumption": "< 140mA (with radar active)",
      "Min Illumination": "0.01 Lux Night-Vision Boost",
      "Environmental": "IP69K High Pressure Wash Certified",
      "Operating Temp": "-40°C to +85°C (-40°F to 185°F)",
      "Wiring Connector": "Direct plug 4-Pin mini DIN with RCA pigtail"
    }
  },
  {
    id: "cam90",
    name: "Ultra-Wide Dynamic CMOS Flush Camera",
    sku: "CAM90-PRO",
    price: 49.50,
    originalPrice: 65.00,
    category: "cameras",
    tag: "BESTSELLER",
    image: rvcScene,
    rating: 4.8,
    reviewsCount: 84,
    inStock: true,
    stockCount: 118,
    voltage: "12V DC",
    fieldOfView: "170° Wide Angle",
    environmentalRating: "IP68 Waterproof",
    description: "Compact multi-mount backup camera with starlight night vision and selectable mirror image for front or rear installation.",
    highlights: [
      "Keyhole or bracket multi-mount options included",
      "Auto white balance & gain control",
      "Low lux night sensitivity",
      "Removable grid lines"
    ],
    specs: {
      "Sensor": "1/4\" Color CMOS",
      "Resolution": "720 x 480 NTSC",
      "FOV": "170° Diagonal",
      "Rating": "IP68 Submersible",
      "Connector": "RCA Video with Power Wire"
    }
  },
  {
    id: "led8",
    name: "RGB LED App-Controlled Interior Lighting Kit",
    sku: "LED8-BLU",
    price: 62.00,
    originalPrice: 79.00,
    category: "lighting",
    tag: "ACCENT MOBILE",
    image: nightDrive,
    rating: 4.7,
    reviewsCount: 52,
    inStock: true,
    stockCount: 29,
    voltage: "12V DC",
    fieldOfView: "N/A",
    environmentalRating: "IP65 Interior",
    description: "16 million color smartphone-controlled underdash and seating zone LED lighting with music pulse sync and OEM door trigger input.",
    highlights: [
      "Bluetooth Low Energy instant pairing",
      "Dedicated courtesy door trigger mode (soft white on door open)",
      "4 high-density weatherproof flexible light strips",
      "In-line fuse & switch harness"
    ],
    specs: {
      "Output Channels": "4 Light Zone Strips",
      "Connectivity": "BLE 5.2 Smartphone Control",
      "Voltage": "10V–15V DC",
      "Current Draw": "1.2A Max at full brightness"
    }
  },
  {
    id: "act200",
    name: "Heavy-Duty 2-Wire Door Lock Actuator Kit",
    sku: "ACT-2W-HD",
    price: 24.95,
    originalPrice: 32.00,
    category: "wiring",
    tag: "INSTALLER PRO",
    image: rvcProduct,
    rating: 4.9,
    reviewsCount: 210,
    inStock: true,
    stockCount: 340,
    voltage: "12V DC",
    fieldOfView: "N/A",
    environmentalRating: "Heavy Duty Sealed",
    description: "Direct-drive Japanese motor actuator delivering up to 12 lbs of push/pull force with rotatable 360-degree head for difficult door rod angles.",
    highlights: [
      "High torque metal-reinforced gears",
      "Rotatable head for easy linkage alignment",
      "Includes zinc-plated mounting strap & rod clamp",
      "Tested for 100,000+ continuous cycles"
    ],
    specs: {
      "Force": "Up to 12 lbs push / pull",
      "Stroke Length": "18mm",
      "Duty Cycle": "Intermittent pulse",
      "Warranty": "3-Year Bay Installer Guarantee"
    }
  }
];

export const FAQS = [
  {
    q: "How does the RVC180CTD detect moving cross-traffic?",
    a: "It integrates a miniature millimeter-wave radar sensor alongside the optical lens. The radar measures Doppler frequency shifts from approaching objects traveling > 2 mph, highlighting them with red warning HUD boxes on your factory or aftermarket radio screen."
  },
  {
    q: "Can this work with factory OEM screens?",
    a: "Yes! With an Accele or third-party vehicle video integration interface (such as standard composite RCA or AHD camera inputs), the system overlays graphics directly into the camera video feed before sending it to the monitor."
  },
  {
    q: "What is dealer Tier 1 pricing eligibility?",
    a: "Tier 1 pricing is unlocked for licensed 12-volt electronics installation shops, automotive dealerships, and commercial fleet installers with active resale tax certificates."
  }
];
