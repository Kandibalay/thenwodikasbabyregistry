// Registry items. Prices in Naira.
// `img` points to /public/items/<file>. Swap these for your own photos anytime.
export const items = [
  { id: 1, name: "Baby Bathing Set / Changing Station", price: 150000, img: "/items/babybathingset.jpeg" },
  { id: 2, name: "Baby Next-to-Me Bassinet (Bed)", price: 160000, img: "/items/babyBed.jpeg" },
  { id: 3, name: "Baby Bottle Sterilizer / Dryer", price: 80000, img: "/items/babybottlesdryer.jpeg" },
  { id: 4, name: "Baby Car Seat", price: 65000, img: "/items/babycarset.jpeg" },
  { id: 5, name: "Baby Carrier", price: 35000, img: "/items/babycarrier.jpeg" },
  { id: 6, name: "Baby Nest", price: 35000, img: "/items/Babynest.jpeg" },
  { id: 7, name: "Huggies Diapers", price: 80000, img: "/items/Huggiesdiaper.jpeg" },
  { id: 8, name: "Comfort Fabric Conditioner", price: 24000, img: "/items/comforconditioner.jpeg" },
  { id: 9, name: "Milk / Food Warmer", price: 50000, img: "/items/MilkWarmernew.jpeg" },
  { id: 10, name: "Thermo Flask (Set of 2)", price: 70000, img: "/items/ThermoFlasknew.jpeg" },
  { id: 11, name: "Wardrobe", price: 160000, img: "/items/wardrobenew.jpeg" },
];

export const tiers = [
  { key: "full", label: "Full", fraction: 1 },
  { key: "three_quarter", label: "75%", fraction: 0.75 },
  { key: "half", label: "Half", fraction: 0.5 },
  { key: "quarter", label: "Quarter", fraction: 0.25 },
];

export const payment = {
  bank: "Access Bank",
  accountNumber: "1111348161",
  accountName: "Nwodika Roy",
};

export const naira = (n) =>
  "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });
