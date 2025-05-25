import React, { useState } from "react";
import WagonsTable from "./WagonsTable";
import CraneInterface from "./CraneInterface";
import HistoryTab from "./HistoryTab";

const TABS = [
  { key: "wagons", label: "🚂 Вагоны" },
  { key: "cranes", label: "🛠 Краны" },
  { key: "history", label: "📜 История" }
];

const App = () => {
  const [activeTab, setActiveTab] = useState("wagons");

  // Для передачи истории между компонентами
  const [actionsHistory, setActionsHistory] = useState([]);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <nav style={{ display: "flex", gap: 8, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "1rem 2rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "0.7rem 2rem",
              background: activeTab === tab.key ? "#1e293b" : "#f1f5f9",
              color: activeTab === tab.key ? "#fff" : "#1e293b",
              border: activeTab === tab.key ? "2px solid #1e293b" : "1px solid #d1d5db",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.12s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "2rem" }}>
        {activeTab === "wagons" && <WagonsTable />}
        {activeTab === "cranes" && <CraneInterface actionsHistory={actionsHistory} setActionsHistory={setActionsHistory} />}
        {activeTab === "history" && <HistoryTab actionsHistory={actionsHistory} />}
      </div>
    </div>
  );
};

export default App;