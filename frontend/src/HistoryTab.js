import React from "react";

const directionColors = {
  европа: "#4ade80",
  алматы: "#fde047",
  узбекистан: "#f87171"
};

const HistoryTab = ({ actionsHistory }) => {
  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: "1.6rem", marginBottom: 20 }}>📜 История действий с контейнерами</h2>
      <table style={{ borderCollapse: "collapse", minWidth: 800 }}>
        <thead>
          <tr>
            <th style={th}>Время</th>
            <th style={th}>Операция</th>
            <th style={th}>Кран</th>
            <th style={th}>Этаж</th>
            <th style={th}>Ряд</th>
            <th style={th}>Колонка</th>
            <th style={th}>Контейнер</th>
            <th style={th}>Направление</th>
          </tr>
        </thead>
        <tbody>
          {actionsHistory.length === 0 ? (
            <tr>
              <td style={td} colSpan={8}>Нет действий</td>
            </tr>
          ) : (
            actionsHistory.map((item, idx) => (
              <tr key={idx}>
                <td style={td}>{item.time}</td>
                <td style={td}>
                  {item.action === "add" ? "Добавление" : "Удаление"}
                </td>
                <td style={td}>{item.crane + 1}</td>
                <td style={td}>{item.row + 1}</td>
                <td style={td}>{item.stack + 1}</td>
                <td style={td}>{item.col + 1}</td>
                <td style={td}>{item.number}</td>
                <td style={{ ...td, background: directionColors[item.direction], color: "#222", fontWeight: 600 }}>{item.direction}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const th = { border: "1px solid #d1d5db", background: "#f3f4f6", padding: "6px 12px", fontWeight: 600 };
const td = { border: "1px solid #d1d5db", background: "#fff", padding: "6px 12px", textAlign: "center" };

export default HistoryTab;