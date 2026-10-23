"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  Search,
  LogOut,
  ExternalLink,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  FileText,
  Sparkles
} from "lucide-react";
import { getAdminSession, clearAdminSession, AdminUser } from "@/lib/adminAuth";
import {
  FloralOrder,
  OrderStatus,
  getStoredOrders,
  updateOrderStatus
} from "@/lib/ordersData";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<FloralOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<FloralOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setUser(session);
    setOrders(getStoredOrders());
  }, [router]);

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/admin/login");
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => (o.status !== "Cancelled" ? sum + o.totalAmount : sum), 0);
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const confirmedCount = orders.filter((o) => o.status === "Confirmed").length;
    const completedCount = orders.filter((o) => o.status === "Completed").length;

    return {
      totalRev,
      totalOrders: orders.length,
      pendingCount,
      confirmedCount,
      completedCount,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const updatedList = updateOrderStatus(selectedOrder.id, newStatus);
    setOrders(updatedList);
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  if (!user) {
    return null; // Brief flash while redirecting or verifying
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Admin Navigation Bar */}
      <header className="admin-nav-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/admin" className="admin-nav-brand">
            <Image
              src="/assets/jnr_flower_icon.png"
              alt="JNR"
              width={30}
              height={30}
              className="admin-nav-flower"
            />
            <span className="admin-nav-logo-text">JNR Flowers</span>
          </Link>
          <span className="admin-nav-badge">Admin Portal</span>
        </div>

        <div className="admin-nav-actions">
          <div className="admin-nav-user-pill">
            <div className="admin-user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
          </div>

          <button onClick={handleLogout} className="admin-nav-btn admin-logout-btn" title="Sign out">
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="admin-main-content">
        {/* Header Title & Date */}
        <div className="admin-header-row">
          <div className="admin-heading-col">
            <h1>Orders &amp; Inquiries Dashboard</h1>
            <p>Monitor luxury wedding setups, corporate galas, and wholesale cut flower logistics</p>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#73706a", background: "#ffffff", padding: "8px 16px", borderRadius: "9999px", border: "1px solid #e5dfd4" }}>
            📅 Today: {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

        {/* 4 Metric Overview Cards */}
        <section className="admin-metrics-grid">
          {/* Total Revenue */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Total Booking Value</span>
              <div className="metric-icon-wrap metric-icon-orange">
                <IndianRupee size={20} />
              </div>
            </div>
            <div className="metric-card-value">
              ₹{metrics.totalRev.toLocaleString("en-IN")}
            </div>
            <div className="metric-card-footer">
              <span className="metric-badge-up">↑ 18.5%</span>
              <span>vs previous month</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Total Bookings</span>
              <div className="metric-icon-wrap metric-icon-purple">
                <Package size={20} />
              </div>
            </div>
            <div className="metric-card-value">{metrics.totalOrders}</div>
            <div className="metric-card-footer">
              <span>Across Ahmedabad &amp; Gandhinagar</span>
            </div>
          </div>

          {/* Pending Inquiries */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Pending Inquiries</span>
              <div className="metric-icon-wrap metric-icon-blue">
                <Clock size={20} />
              </div>
            </div>
            <div className="metric-card-value">{metrics.pendingCount}</div>
            <div className="metric-card-footer">
              <span style={{ color: "#d97706", fontWeight: 600 }}>Action Needed</span>
              <span>• Review required</span>
            </div>
          </div>

          {/* Confirmed & Delivered */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-label">Confirmed Setups</span>
              <div className="metric-icon-wrap metric-icon-green">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="metric-card-value">{metrics.confirmedCount}</div>
            <div className="metric-card-footer">
              <span>{metrics.completedCount} completed successfully</span>
            </div>
          </div>
        </section>

        {/* Orders Table Panel */}
        <section className="admin-table-panel">
          {/* Toolbar: Search & Filter */}
          <div className="admin-table-toolbar">
            <div className="search-input-wrap">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Search by client, ID, venue, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="status-filter-pills">
              {["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`status-filter-pill ${statusFilter === status ? "active" : ""}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Service Type</th>
                  <th>Event Date</th>
                  <th>Venue / Location</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px", color: "#8c8983" }}>
                      No orders found matching &ldquo;{searchQuery}&rdquo; in {statusFilter} status.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id-badge">{order.id}</span>
                      </td>
                      <td>
                        <div className="client-name-cell">
                          <span>{order.clientName}</span>
                          <span className="client-contact-sub">{order.phone}</span>
                        </div>
                      </td>
                      <td>
                        <div className="service-type-badge">
                          <Sparkles size={14} color="#F05A22" />
                          <span>{order.serviceType}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3d3b37" }}>
                          <Calendar size={14} color="#73706a" />
                          <span>{order.eventDate}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#55514b", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={order.location}>
                          <MapPin size={14} color="#73706a" style={{ flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{order.location}</span>
                        </div>
                      </td>
                      <td>
                        <span className="order-amount-text">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                      </td>
                      <td>
                        <span className={`order-status-pill status-${order.status.toLowerCase().replace(" ", "-")}`}>
                          <span className="status-dot" />
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="table-action-btn"
                          title="View order details"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Order Details & Status Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-col">
                <h2>{selectedOrder.serviceType}</h2>
                <span>Order Reference: <strong style={{ color: "#171615" }}>{selectedOrder.id}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Key Client Info Grid */}
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-info-label">Client Name</span>
                  <span className="modal-info-value">{selectedOrder.clientName}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Event Date</span>
                  <span className="modal-info-value">{selectedOrder.eventDate}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Phone Contact</span>
                  <span className="modal-info-value">
                    <a href={`tel:${selectedOrder.phone}`} style={{ color: "#F05A22", textDecoration: "none" }}>
                      {selectedOrder.phone}
                    </a>
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Email Address</span>
                  <span className="modal-info-value">{selectedOrder.email}</span>
                </div>
                <div className="modal-info-item" style={{ gridColumn: "span 2" }}>
                  <span className="modal-info-label">Venue Location</span>
                  <span className="modal-info-value">{selectedOrder.location}</span>
                </div>
                <div className="modal-info-item" style={{ gridColumn: "span 2" }}>
                  <span className="modal-info-label">Total Booking Value</span>
                  <span className="modal-info-value" style={{ fontSize: "1.4rem", color: "#10b981", fontFamily: "var(--font-display, serif)" }}>
                    ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Items / Floral Deliverables */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="modal-section-box">
                  <span className="modal-section-title">Decor Scope &amp; Floral Arrangements</span>
                  <ul className="modal-items-list">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        <Sparkles size={14} color="#F05A22" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="modal-section-box">
                  <span className="modal-section-title">Client Requirements &amp; Notes</span>
                  <div style={{ background: "#faf7f2", padding: "14px", borderRadius: "12px", border: "1px solid #f0ece6", fontSize: "0.9rem", color: "#474440", lineHeight: 1.5 }}>
                    {selectedOrder.notes}
                  </div>
                </div>
              )}

              {/* Update Status Selector */}
              <div className="modal-section-box">
                <span className="modal-section-title">Update Booking Status</span>
                <div className="modal-status-selector">
                  {(["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`status-choice-btn ${selectedOrder.status === st ? "selected" : ""}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="admin-login-submit"
                style={{ margin: 0, padding: "10px 24px", fontSize: "0.9rem" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
