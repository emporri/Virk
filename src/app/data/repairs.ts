export interface RepairModel {
  name: string;
  variants: string[];
}

export interface DeviceMake {
  name: string;
  models: RepairModel[];
}

export interface RepairService {
  name: string;
  price: string;
  duration: string;
}

export const DEVICE_MAKES: DeviceMake[] = [
  {
    name: "Apple",
    models: [
      { name: "iPhone 15 Pro Max", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "iPhone 15 Pro", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "iPhone 15 Plus", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 15", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 14 Pro Max", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "iPhone 14 Pro", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "iPhone 14 Plus", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 14", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 13 Pro Max", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "iPhone 13 Pro", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "iPhone 13", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 13 Mini", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 12 Pro Max", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 12 Pro", variants: ["128GB", "256GB", "512GB"] },
      { name: "iPhone 12", variants: ["64GB", "128GB", "256GB"] },
      { name: "iPhone 12 Mini", variants: ["64GB", "128GB", "256GB"] },
      { name: "iPhone 11 Pro Max", variants: ["64GB", "256GB", "512GB"] },
      { name: "iPhone 11 Pro", variants: ["64GB", "256GB", "512GB"] },
      { name: "iPhone 11", variants: ["64GB", "128GB", "256GB"] },
      { name: "iPhone XS Max", variants: ["64GB", "256GB", "512GB"] },
      { name: "iPhone XS", variants: ["64GB", "256GB", "512GB"] },
      { name: "iPhone XR", variants: ["64GB", "128GB", "256GB"] },
      { name: "iPad Pro 12.9\"", variants: ["WiFi", "WiFi + Cellular"] },
      { name: "iPad Pro 11\"", variants: ["WiFi", "WiFi + Cellular"] },
      { name: "iPad Air", variants: ["WiFi", "WiFi + Cellular"] },
      { name: "iPad", variants: ["WiFi", "WiFi + Cellular"] },
      { name: "iPad Mini", variants: ["WiFi", "WiFi + Cellular"] },
      { name: "MacBook Air M1/M2/M3", variants: ["8GB RAM", "16GB RAM", "24GB RAM"] },
      { name: "MacBook Pro 13\"", variants: ["8GB RAM", "16GB RAM"] },
      { name: "MacBook Pro 14\"", variants: ["16GB RAM", "32GB RAM"] },
      { name: "MacBook Pro 16\"", variants: ["16GB RAM", "32GB RAM", "64GB RAM"] },
    ],
  },
  {
    name: "Samsung",
    models: [
      { name: "Galaxy S24 Ultra", variants: ["256GB", "512GB", "1TB"] },
      { name: "Galaxy S24+", variants: ["256GB", "512GB"] },
      { name: "Galaxy S24", variants: ["128GB", "256GB"] },
      { name: "Galaxy S23 Ultra", variants: ["256GB", "512GB", "1TB"] },
      { name: "Galaxy S23+", variants: ["256GB", "512GB"] },
      { name: "Galaxy S23", variants: ["128GB", "256GB"] },
      { name: "Galaxy S22 Ultra", variants: ["128GB", "256GB", "512GB"] },
      { name: "Galaxy S22+", variants: ["128GB", "256GB"] },
      { name: "Galaxy S22", variants: ["128GB", "256GB"] },
      { name: "Galaxy A55", variants: ["128GB", "256GB"] },
      { name: "Galaxy A54", variants: ["128GB", "256GB"] },
      { name: "Galaxy A35", variants: ["128GB", "256GB"] },
      { name: "Galaxy A34", variants: ["128GB", "256GB"] },
      { name: "Galaxy Z Fold 5", variants: ["256GB", "512GB", "1TB"] },
      { name: "Galaxy Z Flip 5", variants: ["256GB", "512GB"] },
      { name: "Galaxy Tab S9 Ultra", variants: ["WiFi", "WiFi + 5G"] },
      { name: "Galaxy Tab S9+", variants: ["WiFi", "WiFi + 5G"] },
      { name: "Galaxy Tab S9", variants: ["WiFi", "WiFi + 5G"] },
    ],
  },
  {
    name: "Google",
    models: [
      { name: "Pixel 8 Pro", variants: ["128GB", "256GB", "512GB", "1TB"] },
      { name: "Pixel 8", variants: ["128GB", "256GB"] },
      { name: "Pixel 7a", variants: ["128GB"] },
      { name: "Pixel 7 Pro", variants: ["128GB", "256GB", "512GB"] },
      { name: "Pixel 7", variants: ["128GB", "256GB"] },
    ],
  },
  {
    name: "OnePlus",
    models: [
      { name: "OnePlus 12", variants: ["256GB", "512GB"] },
      { name: "OnePlus 11", variants: ["128GB", "256GB"] },
      { name: "OnePlus 10 Pro", variants: ["128GB", "256GB"] },
    ],
  },
  {
    name: "Huawei",
    models: [
      { name: "Huawei P60 Pro", variants: ["256GB", "512GB"] },
      { name: "Huawei P50 Pro", variants: ["256GB", "512GB"] },
      { name: "Huawei Mate 50 Pro", variants: ["256GB", "512GB"] },
      { name: "Huawei Nova 11", variants: ["128GB", "256GB"] },
    ],
  },
  {
    name: "Xiaomi",
    models: [
      { name: "Xiaomi 13 Ultra", variants: ["256GB", "512GB", "1TB"] },
      { name: "Xiaomi 13 Pro", variants: ["256GB", "512GB"] },
      { name: "Xiaomi 13", variants: ["128GB", "256GB"] },
      { name: "Redmi Note 13 Pro+", variants: ["256GB", "512GB"] },
    ],
  },
  {
    name: "Sony",
    models: [
      { name: "Xperia 1 V", variants: ["256GB"] },
      { name: "Xperia 5 V", variants: ["128GB", "256GB"] },
      { name: "Xperia 10 V", variants: ["128GB"] },
    ],
  },
];

export const REPAIR_SERVICES: RepairService[] = [
  { name: "Screen Replacement", price: "from £49", duration: "30–60 min" },
  { name: "Battery Replacement", price: "from £39", duration: "30–45 min" },
  { name: "Charging Port Repair", price: "from £49", duration: "45–60 min" },
  { name: "Camera Repair / Replacement", price: "from £59", duration: "45–90 min" },
  { name: "Water Damage Repair", price: "from £79", duration: "2–3 hours" },
  { name: "Back Glass Replacement", price: "from £59", duration: "30–60 min" },
  { name: "Speaker / Microphone Repair", price: "from £45", duration: "30–45 min" },
  { name: "Button Repair (Home/Power/Volume)", price: "from £45", duration: "30–60 min" },
  { name: "Software Troubleshooting", price: "from £29", duration: "30–60 min" },
  { name: "Full Diagnostic", price: "£0 (Free)", duration: "15–30 min" },
];
