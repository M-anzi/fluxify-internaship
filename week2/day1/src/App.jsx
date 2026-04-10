// App.jsx - Main application component with all styles included
import './App.css';

// Sub-component 1: Avatar
function Avatar({ imageUrl, name }) {
  return (
    <div className="avatar-container">
      <img src={imageUrl} alt={`${name}'s avatar`} className="avatar" />
    </div>
  );
}

// Sub-component 2: Bio
function Bio({ text }) {
  return (
    <p className="bio">
      {text}
    </p>
  );
}

// Sub-component 3: Badge
function Badge({ text }) {
  return (
    <span className="badge">
      ✨ {text}
    </span>
  );
}

// ProfileCard component that uses all sub-components
function ProfileCard({ name, role, bio, avatarUrl, availableForHire }) {
  return (
    <div className="profile-card">
      <Avatar imageUrl={avatarUrl} name={name} />
      <div className="profile-info">
        <h3>{name}</h3>
        <p className="role">{role}</p>
        <Bio text={bio} />
        {/* Conditional rendering: Badge only appears when availableForHire is true */}
        {availableForHire && <Badge text="Available for hire" />}
      </div>
    </div>
  );
}

// Task 2: SkillsList component with .map() and conditional rendering
function SkillsList({ skills }) {
  return (
    <div className="skills-container">
      {skills.length > 0 ? (
        <ul className="skills-list">
          {skills.map((skill, index) => (
            // Each list item needs a unique key prop to help React identify which items
            // have changed, been added, or removed. Without keys, React may re-render
            // the entire list inefficiently and cause bugs with component state.
            // Keys give elements a stable identity across renders, optimizing the
            // reconciliation process.
            <li key={index} className="skill-item">
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        // Conditional rendering: Show this message when the skills array is empty
        <p className="empty-message">📭 No items found. Add some skills to display!</p>
      )}
    </div>
  );
}

function App() {
  // Sample data for three different profiles
  const profiles = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Frontend Developer',
      bio: 'Passionate about creating responsive and accessible web applications with React and modern CSS.',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      availableForHire: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'UX/UI Designer',
      bio: 'Designing beautiful and intuitive interfaces that solve real user problems.',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      availableForHire: false,
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Full Stack Engineer',
      bio: 'Building robust backend systems and seamless frontend experiences.',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      availableForHire: true,
    },
  ];

  // Sample skills data for Task 2 - showing an array of items
  const skills = ['React', 'JavaScript', 'CSS3', 'HTML5', 'Vite', 'Git'];

  // Empty array to demonstrate conditional rendering message
  const emptySkills = [];

  return (
    <div className="app">
      <h1>Developer Profiles</h1>
      <div className="profile-container">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            role={profile.role}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            availableForHire={profile.availableForHire}
          />
        ))}
      </div>

      {/* Task 2: JSX Exploration Component with .map() and conditional rendering */}
      <h2>Technical Skills</h2>
      <SkillsList skills={skills} />

      <h2>Empty Skills List (Conditional Rendering Demo)</h2>
      <SkillsList skills={emptySkills} />
    </div>
  );
}

export default App;