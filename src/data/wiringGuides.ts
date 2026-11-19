export interface PinInfo {
  label: string;
  desc: string;
  colorClass: string;
  wireColorHex: string;
  voltage: string;
}

export interface WiringGuideData {
  categoryId: string;
  docNumber: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: "cyan" | "emerald" | "amber" | "destructive" | "default";
  pins: PinInfo[];
  note: string;
  instructions: string[];
  buttonLabel: string;
}

export const WIRING_GUIDES: Record<string, WiringGuideData> = {
  cameras: {
    categoryId: "cameras",
    docNumber: "DOC-AC-CAM-REV4.2",
    title: "4-Pin Mini DIN Pinout",
    subtitle: "Standard Accele Pro Video Bus",
    badgeText: "BAY VERIFIED",
    badgeVariant: "cyan",
    pins: [
      { 
        label: "PIN 1 (Red):", 
        desc: "+12V Reverse Lamp Trigger", 
        colorClass: "text-rose-600 font-bold",
        wireColorHex: "#ef4444",
        voltage: "12V - 14.4V DC"
      },
      { 
        label: "PIN 2 (Black):", 
        desc: "Chassis Ground", 
        colorClass: "text-slate-600 font-bold",
        wireColorHex: "#1e293b",
        voltage: "0V Ground"
      },
      { 
        label: "PIN 3 (Yellow):", 
        desc: "Video Positive (CVBS / AHD)", 
        colorClass: "text-amber-600 font-bold",
        wireColorHex: "#f59e0b",
        voltage: "1.0Vp-p 75Ω"
      },
      { 
        label: "PIN 4 (White):", 
        desc: "Audio Buzzer Output", 
        colorClass: "text-sky-600 font-bold",
        wireColorHex: "#0284c7",
        voltage: "5V Logic / Audio"
      },
    ],
    note: "Loop cut wire (Green): Cut loop to disable dynamic parking guideline overlay. Loop cut wire (White): Cut to switch from Mirror/Reverse to Normal/Front view.",
    instructions: [
      "Bench test camera and display feed before running the 4-pin extension cable through vehicle trunk or chassis.",
      "Use provided silicone grommet for firewall pass-through to prevent insulation wear and water intrusion.",
      "Ensure chassis ground (PIN 2) is bonded directly to clean, unpainted bare metal on the vehicle body.",
      "If trimming green or white loop wires, ensure 12V power is disconnected and insulate wire ends with heat shrink."
    ],
    buttonLabel: "Download Full PDF Bay Guide",
  },
  wiring: {
    categoryId: "wiring",
    docNumber: "DOC-AC-REL-REV2.1",
    title: "SPDT Switch & Actuator Terminal Pinout",
    subtitle: "Standard Accele Industrial 12V/24V Bay Pinout",
    badgeText: "SAE VERIFIED",
    badgeVariant: "emerald",
    pins: [
      { 
        label: "COM (Pin 30):", 
        desc: "Common 12V DC Supply / Power Tap", 
        colorClass: "text-slate-700 font-bold",
        wireColorHex: "#334155",
        voltage: "12V Fused 30A"
      },
      { 
        label: "NC (Pin 87a):", 
        desc: "Normally Closed (Resting contact)", 
        colorClass: "text-sky-600 font-bold",
        wireColorHex: "#0284c7",
        voltage: "Resting Circuit"
      },
      { 
        label: "NO (Pin 87):", 
        desc: "Normally Open (+12V output on trigger)", 
        colorClass: "text-rose-600 font-bold",
        wireColorHex: "#ef4444",
        voltage: "Switched 12V Out"
      },
      { 
        label: "Motor Leads:", 
        desc: "2-Wire Polarity Reversing Motor Actuator", 
        colorClass: "text-amber-600 font-bold",
        wireColorHex: "#f59e0b",
        voltage: "Reversible 12V"
      },
    ],
    note: "Polarity Reversal: For central door-locking actuators, ensure inline 15A fuse is installed before tying into factory BCM harness.",
    instructions: [
      "Always disconnect vehicle negative battery terminal prior to splicing into vehicle locking or ignition harness.",
      "Ensure SPDT relay sockets use 14 AWG copper wire minimum for 30A high-draw circuits.",
      "Install quenching diode (1N4004) across relay coil pins 85 and 86 to prevent voltage spikes into the vehicle BCM."
    ],
    buttonLabel: "Download Relay & Actuator Schematic PDF",
  },
  security: {
    categoryId: "security",
    docNumber: "DOC-AC-SEC-REV5.0",
    title: "Primary Vehicle Security Harness",
    subtitle: "Multi-Zone Telematics & Starter Kill Harness",
    badgeText: "PRO BAY VERIFIED",
    badgeVariant: "cyan",
    pins: [
      { 
        label: "PIN 1 (Red - 12 AWG):", 
        desc: "+12V Constant Battery Tap (Fused 30A)", 
        colorClass: "text-rose-600 font-bold",
        wireColorHex: "#ef4444",
        voltage: "12V Constant"
      },
      { 
        label: "PIN 2 (Black):", 
        desc: "Direct Chassis Ground (Clean bare metal)", 
        colorClass: "text-slate-700 font-bold",
        wireColorHex: "#1e293b",
        voltage: "0V Ground"
      },
      { 
        label: "PIN 3 (Yellow):", 
        desc: "Ignition 1 Switched (+12V Run & Crank)", 
        colorClass: "text-amber-600 font-bold",
        wireColorHex: "#f59e0b",
        voltage: "12V Switched"
      },
      { 
        label: "PIN 4 (Brown):", 
        desc: "Siren (+) Positive Output (2A Max Drive)", 
        colorClass: "text-sky-600 font-bold",
        wireColorHex: "#0284c7",
        voltage: "12V Pulse"
      },
      { 
        label: "PIN 5 (Violet/Green):", 
        desc: "(+ / -) Door Pin Sense Triggers", 
        colorClass: "text-emerald-600 font-bold",
        wireColorHex: "#10b981",
        voltage: "Sense Bias"
      },
    ],
    note: "Tachometer Sensing: Program tachometer sense or tachless voltage monitor before initiating remote starter sequence to prevent starter grind.",
    instructions: [
      "Connect starter kill relay in-line with the vehicle starter solenoid wire (cut wire, key side to Pin 87a, starter side to Pin 30).",
      "Mount shock sensor securely to main metal vehicle crossmember with heavy-duty zip ties for optimal acoustic sensitivity.",
      "Program remote fobs and confirm Siren chirp verification before closing dashboard panels."
    ],
    buttonLabel: "Download Security & Remote Start Guide PDF",
  },
  lighting: {
    categoryId: "lighting",
    docNumber: "DOC-AC-LGT-REV3.1",
    title: "12V DC Low-Voltage Lighting Harness",
    subtitle: "Direct Bay Power & Courtesy Dimmer Wiring",
    badgeText: "DOT COMPLIANT",
    badgeVariant: "amber",
    pins: [
      { 
        label: "Wire 1 (Red / +):", 
        desc: "+12V Switched Power / Interior Dome Tap", 
        colorClass: "text-rose-600 font-bold",
        wireColorHex: "#ef4444",
        voltage: "12V Fused 5A-10A"
      },
      { 
        label: "Wire 2 (Black / -):", 
        desc: "Chassis Ground (-)", 
        colorClass: "text-slate-700 font-bold",
        wireColorHex: "#1e293b",
        voltage: "0V Ground"
      },
      { 
        label: "Wire 3 (Yellow / PWM):", 
        desc: "Optional Courtesy Dimmer / Door Trigger", 
        colorClass: "text-amber-600 font-bold",
        wireColorHex: "#f59e0b",
        voltage: "PWM / Ground Pulse"
      },
    ],
    note: "Reverse Polarity Protection: Integrated diode prevents board damage in case of inverted leads. Tap into fused 5A-10A auxiliary interior circuit.",
    instructions: [
      "Verify maximum current draw does not exceed circuit branch rating before tying into vehicle interior illumination circuit.",
      "Route wiring away from hot heater cores, steering shafts, and sharp stamped metal edges.",
      "Use automotive grade cloth tesa tape to bundle and protect exposed wire runs."
    ],
    buttonLabel: "Download Lighting Installation Sheet PDF",
  },
  gps: {
    categoryId: "gps",
    docNumber: "DOC-AC-DSH-REV1.8",
    title: "Dash Port & Pass-Through Harness",
    subtitle: "High-Speed Audio/Video & Fast-Charge Interface",
    badgeText: "OEM COMPLIANT",
    badgeVariant: "emerald",
    pins: [
      { 
        label: "Power Lead (Red):", 
        desc: "+12V ACC Accessory Circuit (Fused 5A)", 
        colorClass: "text-rose-600 font-bold",
        wireColorHex: "#ef4444",
        voltage: "12V ACC"
      },
      { 
        label: "Ground Lead (Black):", 
        desc: "Negative Chassis Ground Tap (-)", 
        colorClass: "text-slate-700 font-bold",
        wireColorHex: "#1e293b",
        voltage: "0V Ground"
      },
      { 
        label: "Port 1 (USB-C/USB-A):", 
        desc: "45W Fast Charging & Data Pass-Through", 
        colorClass: "text-sky-600 font-bold",
        wireColorHex: "#0284c7",
        voltage: "PD 3.0 / 5V-20V"
      },
      { 
        label: "Port 2 (HDMI/3.5mm):", 
        desc: "Direct A/V Feed to Head Unit / Display", 
        colorClass: "text-amber-600 font-bold",
        wireColorHex: "#f59e0b",
        voltage: "Digital / Analog AV"
      },
    ],
    note: "High-Speed Data: Keep overall USB/HDMI cable runs under 15 feet to prevent signal degradation and maintain Apple CarPlay / Android Auto sync.",
    instructions: [
      "Select a clean flat dash or console location with minimum 2.5 inches of clearance behind the mounting surface.",
      "Use a standard 1-1/16\" (28mm) hole saw for dash mount flush-socket installation.",
      "Connect accessory red lead to ignition-switched power to prevent parasitic battery draw when vehicle is parked."
    ],
    buttonLabel: "Download Dash Port Spec Sheet PDF",
  },
};
