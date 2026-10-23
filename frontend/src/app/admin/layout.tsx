import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Portal | JNR Flowers",
  description: "Management dashboard for JNR Flowers orders, decoration bookings, and auction logistics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root-wrapper">
      {children}
    </div>
  );
}
