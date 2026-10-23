export type OrderStatus = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";

export interface FloralOrder {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceType: "Wedding & Mandap Decor" | "Corporate Galas & Events" | "Fresh Cut Flower Supply" | "Custom Floral Sculptures";
  eventDate: string;
  location: string;
  totalAmount: number; // in INR
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  items?: string[];
}

export const INITIAL_ORDERS: FloralOrder[] = [
  {
    id: "JNR-2026-101",
    clientName: "Radhika Patel",
    email: "radhika.patel@gmail.com",
    phone: "+91 98251 44321",
    serviceType: "Wedding & Mandap Decor",
    eventDate: "2026-11-14",
    location: "Sindhu Bhavan Rd, Ahmedabad",
    totalAmount: 375000,
    status: "Confirmed",
    createdAt: "2026-10-22",
    notes: "Grand pastel mandap with fresh Dutch peonies, imported roses, and golden marigold ceiling hangings.",
    items: ["Grand Mandap Structure", "Welcome Gate Arch", "Bridal Entry Floral Tunnel", "Stage Backdrop (1000+ stems)"]
  },
  {
    id: "JNR-2026-102",
    clientName: "Aakash Mehta",
    email: "mehta.aakash@outlook.com",
    phone: "+91 99042 88123",
    serviceType: "Corporate Galas & Events",
    eventDate: "2026-11-02",
    location: "GIFT City Grand Ballroom, Gandhinagar",
    totalAmount: 185000,
    status: "In Progress",
    createdAt: "2026-10-21",
    notes: "Executive stage podium arrangement and 35 centerpieces using exotic purple orchids and gerberas.",
    items: ["35x Table Centerpieces", "VIP Podium Display", "Entrance Floral Pillars"]
  },
  {
    id: "JNR-2026-103",
    clientName: "Pooja Shah",
    email: "poojashah.decor@yahoo.com",
    phone: "+91 97233 11994",
    serviceType: "Fresh Cut Flower Supply",
    eventDate: "2026-10-28",
    location: "Prahlad Nagar, Ahmedabad",
    totalAmount: 64000,
    status: "Pending",
    createdAt: "2026-10-23",
    notes: "Auction-fresh bulk stems delivery for Diwali banquet: 400x Marigolds, 200x Red Dutch Roses.",
    items: ["400x Golden Marigold bunches", "200x Royal Velvet Roses", "50x Carnations"]
  },
  {
    id: "JNR-2026-104",
    clientName: "Nirav Desai",
    email: "desai.nirav99@gmail.com",
    phone: "+91 98980 55678",
    serviceType: "Custom Floral Sculptures",
    eventDate: "2026-12-05",
    location: "Kensville Golf Club, Ahmedabad Outskirts",
    totalAmount: 420000,
    status: "Confirmed",
    createdAt: "2026-10-20",
    notes: "14ft living floral peacock sculpture with cascading blue hydrangea and purple vanda orchids.",
    items: ["14ft Floral Sculpture Frame", "Custom Hydrangea & Orchid Weave", "Cold-Storage Delivery Support"]
  },
  {
    id: "JNR-2026-105",
    clientName: "Sneha Trivedi",
    email: "snehatrivedi@hotmail.com",
    phone: "+91 94265 99341",
    serviceType: "Wedding & Mandap Decor",
    eventDate: "2026-11-20",
    location: "Bodakdev, Ahmedabad",
    totalAmount: 290000,
    status: "Pending",
    createdAt: "2026-10-23",
    notes: "Sangeet stage backdrop + traditional yellow and orange marigold canopy with brass diyas.",
    items: ["Sangeet Stage Wall", "Ceiling Marigold Jaali", "Photo Booth Floral Arch"]
  },
  {
    id: "JNR-2026-106",
    clientName: "Kunal Jhaveri",
    email: "kunal.jhaveri@jewels.com",
    phone: "+91 98240 77312",
    serviceType: "Corporate Galas & Events",
    eventDate: "2026-10-18",
    location: "The Fern Hotel, SG Highway, Ahmedabad",
    totalAmount: 120000,
    status: "Completed",
    createdAt: "2026-10-14",
    notes: "Product launch botanical theme. Delivered and dismantled on time.",
    items: ["Entry Tunnel", "Showcase Table Runners", "Floral Monogram Backdrop"]
  }
];

const STORAGE_KEY = "jnr_admin_orders";

export function getStoredOrders(): FloralOrder[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: FloralOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save orders in localStorage", err);
  }
}

export function updateOrderStatus(id: string, status: OrderStatus): FloralOrder[] {
  const current = getStoredOrders();
  const updated = current.map((order) =>
    order.id === id ? { ...order, status } : order
  );
  saveStoredOrders(updated);
  return updated;
}
