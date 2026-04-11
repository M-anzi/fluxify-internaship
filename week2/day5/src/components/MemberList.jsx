import MemberCard from "./MemberCard";

const MemberList = ({ members }) => {
  if (members.length === 0) {
    return (
      <div className="member-list-empty">
        <p className="empty-message">No team members found.</p>
        <p className="empty-submessage">Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="member-list">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default MemberList;