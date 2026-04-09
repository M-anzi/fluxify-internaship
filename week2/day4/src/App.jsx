import { useState } from "react";
import "./App.css";

/* ─────────────────────────────────────────
   TASK 1 — REGISTRATION FORM
───────────────────────────────────────── */
const ROLES = ["Select a role", "Developer", "Designer", "Product Manager", "Marketing", "Other"];

const REG_INITIAL = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
};

function validate(fields) {
  const errors = {};
  if (!fields.fullName.trim()) errors.fullName = "Full name is required.";
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!fields.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  if (!fields.role || fields.role === "Select a role") {
    errors.role = "Please select a role.";
  }
  return errors;
}

function RegistrationForm() {
  const [fields, setFields] = useState(REG_INITIAL);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (success) setSuccess(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setFields(REG_INITIAL);
    setErrors({});
    setSuccess(true);
  }

  return (
    <div className="reg-wrapper">
      <div className="reg-card">
        <div className="reg-header">
          <div className="reg-badge">NEW ACCOUNT</div>
          <h1 className="reg-title">Create your profile</h1>
          <p className="reg-subtitle">Join thousands of teams building better products.</p>
        </div>

        {success && (
          <div className="success-banner">
            <span className="success-icon">✓</span>
            Account created successfully!
          </div>
        )}

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className={`field-group ${errors.fullName ? "has-error" : ""}`}>
            <label className="field-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="field-input"
              placeholder="Jane Doe"
              value={fields.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={`field-group ${errors.email ? "has-error" : ""}`}>
            <label className="field-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="field-input"
              placeholder="jane@example.com"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={`field-group ${errors.password ? "has-error" : ""}`}>
            <label className="field-label" htmlFor="password">Password</label>
            <div className="input-row">
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                className="field-input"
                placeholder="Min. 8 characters"
                value={fields.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-vis"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className={`field-group ${errors.confirmPassword ? "has-error" : ""}`}>
            <label className="field-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-row">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="field-input"
                placeholder="Repeat password"
                value={fields.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-vis"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Role */}
          <div className={`field-group ${errors.role ? "has-error" : ""}`}>
            <label className="field-label" htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="field-input field-select"
              value={fields.role}
              onChange={handleChange}
            >
              {ROLES.map((r) => (
                <option key={r} value={r === "Select a role" ? "" : r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Create Account →
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TASK 2 — LIVE PROFILE PREVIEW
───────────────────────────────────────── */
const AVATAR_COLORS = ["#f97316", "#8b5cf6", "#06b6d4", "#ec4899", "#10b981"];

function getInitials(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function ProfilePreview() {
  const [profile, setProfile] = useState({ name: "", jobTitle: "", bio: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  const hasContent = profile.name || profile.jobTitle || profile.bio;
  const initials = getInitials(profile.name || "?");
  const avatarColor = getAvatarColor(profile.name || "X");

  return (
    <div className="pp-wrapper">
      <div className="pp-page">
        {/* Left: Form */}
        <div className="pp-form-col">
          <div className="pp-form-header">
            <span className="pp-form-badge">LIVE PREVIEW</span>
            <h2 className="pp-form-title">Build your card</h2>
            <p className="pp-form-sub">
              Your profile updates as you type — no submit needed.
            </p>
          </div>

          <div className="pp-form">
            <div className="pp-field">
              <label className="pp-label" htmlFor="pp-name">Full Name</label>
              <input
                id="pp-name"
                name="name"
                type="text"
                className="pp-input"
                placeholder="e.g. Alex Rivera"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="pp-job">Job Title</label>
              <input
                id="pp-job"
                name="jobTitle"
                type="text"
                className="pp-input"
                placeholder="e.g. Senior UX Designer"
                value={profile.jobTitle}
                onChange={handleChange}
              />
            </div>

            <div className="pp-field">
              <label className="pp-label" htmlFor="pp-bio">Short Bio</label>
              <textarea
                id="pp-bio"
                name="bio"
                className="pp-input pp-textarea"
                placeholder="A sentence or two about yourself..."
                value={profile.bio}
                onChange={handleChange}
                rows={4}
              />
              <span className="pp-char-count">{profile.bio.length} / 200</span>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="pp-preview-col">
          <p className="pp-preview-label">CARD PREVIEW</p>

          <div className={`pp-card ${hasContent ? "pp-card--active" : "pp-card--empty"}`}>
            <div className="pp-card-bar" style={{ background: avatarColor }} />
            <div className="pp-card-inner">
              <div className="pp-avatar" style={{ background: avatarColor }}>
                {initials}
              </div>
              <div className="pp-card-content">
                <h3 className="pp-card-name">
                  {profile.name || <span className="pp-placeholder">Your Name</span>}
                </h3>
                <p className="pp-card-job">
                  {profile.jobTitle || <span className="pp-placeholder">Job Title</span>}
                </p>
                {(profile.bio || !hasContent) && (
                  <p className="pp-card-bio">
                    {profile.bio || (
                      <span className="pp-placeholder">
                        Your bio will appear here as you type...
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="pp-card-footer">
                <span
                  className="pp-chip"
                  style={{ borderColor: avatarColor, color: avatarColor }}
                >
                  {profile.jobTitle?.split(" ").pop() || "Role"}
                </span>
                <span className="pp-chip pp-chip--muted">Profile</span>
              </div>
            </div>
          </div>

          {!hasContent && (
            <p className="pp-hint">
              Start typing on the left to see your card come to life →
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT APP — Tab Navigation
───────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("register");

  return (
    <div className="app-root">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <span className="app-nav-logo">
            form<span className="app-nav-dot">.</span>lab
          </span>
          <div className="app-nav-tabs">
            <button
              className={`app-tab ${tab === "register" ? "app-tab--active" : ""}`}
              onClick={() => setTab("register")}
            >
              Task 1 — Registration
            </button>
            <button
              className={`app-tab ${tab === "preview" ? "app-tab--active" : ""}`}
              onClick={() => setTab("preview")}
            >
              Task 2 — Live Preview
            </button>
          </div>
        </div>
      </nav>

      <div className="app-content">
        {tab === "register" ? <RegistrationForm /> : <ProfilePreview />}
      </div>
    </div>
  );
}