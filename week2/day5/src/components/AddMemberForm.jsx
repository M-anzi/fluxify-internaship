import { useState } from "react";

const AddMemberForm = ({ onAddMember }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
  });

  const avatarColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.role.trim() || !formData.department.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: formData.name.trim(),
      role: formData.role.trim(),
      department: formData.department.trim(),
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    };

    onAddMember(newMember);
    setFormData({ name: "", role: "", department: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="add-member-form">
      <h2 className="form-title">Add New Team Member</h2>
      <div className="form-grid">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          aria-label="Full name"
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          className="form-input"
          aria-label="Role"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="form-input"
          aria-label="Department"
        />
      </div>
      <button type="submit" className="submit-button">
        Add Member
      </button>
    </form>
  );
};

export default AddMemberForm;