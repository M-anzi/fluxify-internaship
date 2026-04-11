const MemberCard = ({ member }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Map color names to CSS classes
  const getAvatarClass = (colorClass) => {
    const colorMap = {
      'bg-blue-500': 'avatar-blue',
      'bg-green-500': 'avatar-green',
      'bg-purple-500': 'avatar-purple',
      'bg-pink-500': 'avatar-pink',
      'bg-yellow-500': 'avatar-yellow',
      'bg-red-500': 'avatar-red',
      'bg-indigo-500': 'avatar-indigo',
      'bg-orange-500': 'avatar-orange',
    };
    return colorMap[colorClass] || 'avatar-blue';
  };

  return (
    <div className="member-card">
      <div className="card-content">
        <div className="card-inner">
          <div className={`avatar ${getAvatarClass(member.avatarColor)}`}>
            {getInitials(member.name)}
          </div>
          <div className="member-info">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-department">{member.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;