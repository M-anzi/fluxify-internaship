import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS = [
  { id: 1, name: "Amara Osei",      role: "Lead Engineer",       department: "Engineering" },
  { id: 2, name: "Lena Fischer",    role: "Product Designer",    department: "Design" },
  { id: 3, name: "Marcus Tan",      role: "Data Scientist",      department: "Analytics" },
  { id: 4, name: "Priya Nair",      role: "Engineering Manager", department: "Engineering" },
  { id: 5, name: "Jules Moreau",    role: "UX Researcher",       department: "Design" },
  { id: 6, name: "Kofi Agyeman",    role: "DevOps Engineer",     department: "Infrastructure" },
  { id: 7, name: "Sofia Reyes",     role: "Frontend Developer",  department: "Engineering" },
  { id: 8, name: "Tae-yang Park",   role: "Marketing Lead",      department: "Marketing" },
];

const DEPT_COLORS = {
  Engineering:    { bg: "#e8f0fe", text: "#1a56db", border: "#a4cafe" },
  Design:         { bg: "#fdf2f8", text: "#9d174d", border: "#f9a8d4" },
  Analytics:      { bg: "#ecfdf5", text: "#065f46", border: "#6ee7b7" },
  Infrastructure: { bg: "#fff7ed", text: "#9a3412", border: "#fdba74" },
  Marketing:      { bg: "#fefce8", text: "#713f12", border: "#fde68a" },
  Other:          { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
};

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function getDeptStyle(dept) {
  return DEPT_COLORS[dept] || DEPT_COLORS.Other;
}

// Deterministic avatar background from name
function avatarHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

// ─── SearchBar ───────────────────────────────────────────────────────────────

function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
      <input
        type="text"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Search by name or role…"
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
      />
      {query && (
        <button
          onClick={() => onQueryChange("")}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── MemberCard ──────────────────────────────────────────────────────────────

function MemberCard({ member }) {
  const initials = getInitials(member.name);
  const hue = avatarHue(member.name);
  const deptStyle = getDeptStyle(member.department);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-4 overflow-hidden">
      {/* subtle corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-20"
        style={{ background: `hsl(${hue},70%,60%)` }}
      />

      {/* Avatar + name row */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-inner"
          style={{
            background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},65%,45%))`,
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{member.name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{member.role}</p>
        </div>
      </div>

      {/* Department badge */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg border"
          style={{ background: deptStyle.bg, color: deptStyle.text, borderColor: deptStyle.border }}
        >
          {member.department}
        </span>
      </div>
    </div>
  );
}

// ─── MemberList ──────────────────────────────────────────────────────────────

function MemberList({ members }) {
  if (members.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p className="text-sm font-medium">No members match your search</p>
      </div>
    );
  }

  return (
    <>
      {members.map(member => (
        <MemberCard key={member.id} member={member} />
      ))}
    </>
  );
}

// ─── AddMemberForm ───────────────────────────────────────────────────────────

function AddMemberForm({ onAdd }) {
  const EMPTY = { name: "", role: "", department: "" };
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const errs = {};
    if (!fields.name.trim())       errs.name       = "Name is required";
    if (!fields.role.trim())       errs.role       = "Role is required";
    if (!fields.department.trim()) errs.department = "Department is required";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onAdd({ ...fields, id: Date.now() });
    setFields(EMPTY);
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  const inputBase =
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition";
  const inputNormal = `${inputBase} border-gray-200 focus:ring-indigo-400 focus:border-transparent`;
  const inputError  = `${inputBase} border-red-300 focus:ring-red-400 focus:border-transparent`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Add Team Member</h2>
        <p className="text-xs text-gray-500 mt-0.5">Fill in the details below to add someone to the directory.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Full Name",   name: "name",       placeholder: "e.g. Jane Doe" },
          { label: "Role",        name: "role",       placeholder: "e.g. Backend Engineer" },
          { label: "Department",  name: "department", placeholder: "e.g. Engineering" },
        ].map(({ label, name, placeholder }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">{label}</label>
            <input
              type="text"
              name={name}
              value={fields[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={errors[name] ? inputError : inputNormal}
            />
            {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium shadow-sm transition-all duration-150"
        >
          Add Member
        </button>
        {submitted && (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Member added!
          </span>
        )}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [members, setMembers]     = useState(INITIAL_MEMBERS);
  const [searchQuery, setSearch]  = useState("");

  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
  });

  function handleAddMember(newMember) {
    setMembers(prev => [newMember, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Team Directory</h1>
            <p className="text-xs text-gray-500 mt-0.5">{members.length} members</p>
          </div>
          <SearchBar query={searchQuery} onQueryChange={setSearch} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Add form */}
        <AddMemberForm onAdd={handleAddMember} />

        {/* Results label */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `${filteredMembers.length} result${filteredMembers.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `All ${members.length} members`}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MemberList members={filteredMembers} />
        </div>
      </main>
    </div>
  );
}