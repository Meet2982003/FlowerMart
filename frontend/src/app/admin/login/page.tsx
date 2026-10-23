"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { validateAdminLogin, getAdminSession, DEFAULT_ADMIN_CREDENTIALS } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const session = getAdminSession();
    if (session) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const user = validateAdminLogin(identifier, password);
      if (user) {
        router.push("/admin");
      } else {
        setError("Invalid username or password. Please check your credentials.");
        setLoading(false);
      }
    }, 450);
  };

  const handleFillDemo = () => {
    setIdentifier(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-ambient" aria-hidden="true" />

      <div className="admin-login-card">
        {/* Header with Flower Logo */}
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

        {error && <div className="admin-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-input-group">
            <label htmlFor="identifier">Username or Email</label>
            <div className="admin-input-wrap">
              <User size={18} className="admin-input-icon" />
              <input
                id="identifier"
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
            <label htmlFor="password">Password</label>
            <div className="admin-input-wrap">
              <Lock size={18} className="admin-input-icon" />
              <input
                id="password"
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
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper Pill */}
        <div className="admin-demo-helper">
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            <ShieldCheck size={16} color="#F05A22" />
            <span>Demo Credentials</span>
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

        <Link href="/" className="admin-back-link">
          <ArrowLeft size={16} />
          <span>Return to Public Website</span>
        </Link>
      </div>
    </div>
  );
}
