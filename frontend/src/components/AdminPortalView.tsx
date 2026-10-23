"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Package,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  Search,
  LogOut,
  Eye,
  X,
  MapPin,
  Sparkles,
  User,
  Lock,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  getAdminSession,
  setAdminSession,
  clearAdminSession,
  validateAdminLogin,
  DEFAULT_ADMIN_CREDENTIALS,
  AdminUser,
} from "@/lib/adminAuth";
import {
  FloralOrder,
  OrderStatus,
  getStoredOrders,
  updateOrderStatus,
} from "@/lib/ordersData";
import "@/app/admin/admin.css";

interface AdminPortalViewProps {
  onBack?: () => void;
}

export default function AdminPortalView({ onBack }: AdminPortalViewProps) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Login Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard State
  const [orders, setOrders] = useState<FloralOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<FloralOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setCurrentUser(session);
      setOrders(getStoredOrders());
    }
    setIsCheckingAuth(false);
  }, []);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const user = validateAdminLogin(identifier, password);
      if (user) {
        setCurrentUser(user);
        setOrders(getStoredOrders());
      } else {
        setLoginError("Invalid credentials. Try admin@jnr.com / password123");
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleFillDemo = () => {
    setIdentifier(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setLoginError(null);
  };

  const handleLogout = () => {
    clearAdminSession();
    setCurrentUser(null);
    setIdentifier("");
    setPassword("");
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalRev = orders.reduce(
      (sum, o) => (o.status !== "Cancelled" ? sum + o.totalAmount : sum),
      0
    );
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

  if (isCheckingAuth) {
    return null;
  }

  // 1. IF NOT LOGGED IN: Render Login Form
  if (!currentUser) {
    return (
      <div className="admin-login-wrapper" style={{ paddingTop: 100 }}>
        <div className="admin-login-ambient" aria-hidden="true" />

        <div className="admin-login-card">
          <div className="admin-login-header">
            <Image
              src="/assets/jnr_flower_icon.png"
              alt="JNR Flower"
              width={60}
              height={60}
              className="admin-brand-icon"
              priority
            />
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-subtitle">
              Sign in to manage decoration orders &amp; auction logistics
            </p>
          </div>

          {loginError && <div className="admin-error-box">{loginError}</div>}

          <form onSubmit={handleLoginSubmit} className="admin-form">
            <div className="admin-input-group">
              <label htmlFor="admin-identifier">Username or Email</label>
              <div className="admin-input-wrap">
                <User size={18} className="admin-input-icon" />
                <input
                  id="admin-identifier"
                  type="text"
                  placeholder="admin@jnr.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="admin-input"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="admin-pass">Password</label>
              <div className="admin-input-wrap">
                <Lock size={18} className="admin-input-icon" />
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="admin-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="admin-demo-helper">
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
              <ShieldCheck size={16} color="#F05A22" />
              <span>Demo Access Credentials</span>
            </div>
            <div>
              Email: <code>{DEFAULT_ADMIN_CREDENTIALS.email}</code>
              <br />
              Pass: <code>{DEFAULT_ADMIN_CREDENTIALS.password}</code>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="admin-fill-demo-btn"
            >
              Auto-fill credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. IF LOGGED IN: Render Admin Orders Dashboard
  return (
    <div className="admin-dashboard-container" style={{ paddingTop: 90 }}>
      {/* Admin Action Sub-bar */}
      <div
        style={{
          background: "#171615",
          color: "#ffffff",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="admin-nav-badge">Admin Workspace</span>
        </div>

        <div className="admin-nav-actions">
          <div className="admin-nav-user-pill">
            <div className="admin-user-avatar">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <span>{currentUser.username}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-nav-btn admin-logout-btn"
            title="Sign out of Admin session"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <div className="admin-main-content">
        <div className="admin-header-row">
          <div className="admin-heading-col">
            <h1>Orders &amp; Inquiries Dashboard</h1>
            <p>Monitor luxury wedding mandaps, corporate galas, and auction-fresh floral orders</p>
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#73706a",
              background: "#ffffff",
              padding: "8px 16px",
              borderRadius: "9999px",
              border: "1px solid #e5dfd4",
            }}
          >
            📅 Live System:{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* 4 Overview Metrics */}
        <section className="admin-metrics-grid">
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
              {["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`status-filter-pill ${
                      statusFilter === status ? "active" : ""
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

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
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "48px 20px",
                        color: "#8c8983",
                      }}
                    >
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
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#55514b",
                            maxWidth: 220,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={order.location}
                        >
                          <MapPin size={14} color="#73706a" style={{ flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                            {order.location}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="order-amount-text">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`order-status-pill status-${order.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
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
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-col">
                <h2>{selectedOrder.serviceType}</h2>
                <span>
                  Order Reference:{" "}
                  <strong style={{ color: "#171615" }}>{selectedOrder.id}</strong>
                </span>
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
                    <a
                      href={`tel:${selectedOrder.phone}`}
                      style={{ color: "#F05A22", textDecoration: "none" }}
                    >
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
                  <span
                    className="modal-info-value"
                    style={{
                      fontSize: "1.4rem",
                      color: "#10b981",
                      fontFamily: "var(--font-display, serif)",
                    }}
                  >
                    ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="modal-section-box">
                  <span className="modal-section-title">
                    Decor Scope &amp; Floral Arrangements
                  </span>
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

              {selectedOrder.notes && (
                <div className="modal-section-box">
                  <span className="modal-section-title">Client Requirements &amp; Notes</span>
                  <div
                    style={{
                      background: "#faf7f2",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #f0ece6",
                      fontSize: "0.9rem",
                      color: "#474440",
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedOrder.notes}
                  </div>
                </div>
              )}

              <div className="modal-section-box">
                <span className="modal-section-title">Update Booking Status</span>
                <div className="modal-status-selector">
                  {(
                    [
                      "Pending",
                      "Confirmed",
                      "In Progress",
                      "Completed",
                      "Cancelled",
                    ] as OrderStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`status-choice-btn ${
                        selectedOrder.status === st ? "selected" : ""
                      }`}
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
