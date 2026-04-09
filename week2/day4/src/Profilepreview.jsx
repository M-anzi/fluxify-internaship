import { useState } from "react";
import "./ProfilePreview.css";

const AVATAR_COLORS = ["#f97316", "#8b5cf6", "#06b6d4", "#ec4899", "#10b981"];

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ProfilePreview() {
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
        {/* ── Left: Form ── */}
        <div className="pp-form-col">
          <div className="pp-form-header">
            <span className="pp-form-badge">LIVE PREVIEW</span>
            <h2 className="pp-form-title">Build your card</h2>
            <p className="pp-form-sub">Your profile updates as you type — no submit needed.</p>
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

        {/* ── Right: Live Preview ── */}
        <div className="pp-preview-col">
          <p className="pp-preview-label">CARD PREVIEW</p>

          <div className={`pp-card ${hasContent ? "pp-card--active" : "pp-card--empty"}`}>
            {/* Card decorative top bar */}
            <div className="pp-card-bar" style={{ background: avatarColor }} />

            <div className="pp-card-inner">
              {/* Avatar */}
              <div
                className="pp-avatar"
                style={{ background: avatarColor }}
              >
                {initials}
              </div>

              {/* Content */}
              <div className="pp-card-content">
                <h3 className="pp-card-name">
                  {profile.name || <span className="pp-placeholder">Your Name</span>}
                </h3>
                <p className="pp-card-job">
                  {profile.jobTitle || <span className="pp-placeholder">Job Title</span>}
                </p>

                {(profile.bio || !hasContent) && (
                  <p className="pp-card-bio">
                    {profile.bio || <span className="pp-placeholder">Your bio will appear here as you type...</span>}
                  </p>
                )}
              </div>

              {/* Footer chips */}
              <div className="pp-card-footer">
                <span className="pp-chip" style={{ borderColor: avatarColor, color: avatarColor }}>
                  {profile.jobTitle?.split(" ").pop() || "Role"}
                </span>
                <span className="pp-chip pp-chip--muted">Profile</span>
              </div>
            </div>
          </div>

          {!hasContent && (
            <p className="pp-hint">Start typing on the left to see your card come to life →</p>
          )}
        </div>
      </div>
    </div>
  );
}