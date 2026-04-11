import { useState } from "react";
import SearchBar from "./components/SearchBar";
import MemberList from "./components/MemberList";
import AddMemberForm from "./components/AddMemberForm";
import { initialMembers } from "./components/data/initialMembers";
import "./App.css";

const App = () => {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddMember = (newMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  const filteredMembers = members.filter((member) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Team Directory</h1>
        </div>
      </header>

      <main className="app-main">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <AddMemberForm onAddMember={handleAddMember} />
        <MemberList members={filteredMembers} />
      </main>
    </div>
  );
};

export default App;