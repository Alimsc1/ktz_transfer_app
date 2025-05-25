import React, { useState } from "react";

// Пример данных
const DUMMY_DATA = [
  { id: 1, number: "12345678", direction: "европа", status: "ожидание", date: "2025-05-21", track: "узкий" },
  { id: 2, number: "87654321", direction: "алматы", status: "прибыл", date: "2025-05-21", track: "широкий" },
  { id: 3, number: "55556666", direction: "узбекистан", status: "отправлен", date: "2025-05-20", track: "узкий" },
  { id: 4, number: "11223344", direction: "европа", status: "ожидание", date: "2025-05-20", track: "широкий" },
  { id: 5, number: "99887766", direction: "алматы", status: "прибыл", date: "2025-05-19", track: "узкий" }
];

// Цвета — неяркие, прозрачные (rgba, pastel)
const trackColors = {
  широкий: "rgba(54, 113, 204, 0.16)", // пастельный синий
  узкий:   "rgba(239, 68, 68, 0.15)"   // пастельный красный
};
const directionColors = {
  европа:    "rgba(34, 197, 94, 0.15)",   // пастельный зелёный
  алматы:    "rgba(253, 224, 71, 0.18)",  // пастельный жёлтый
  узбекистан:"rgba(239, 68, 68, 0.14)"    // пастельный красный
};
const statusColors = {
  ожидание:  "rgba(253, 224, 71, 0.16)",  // пастельный жёлтый
  прибыл:    "rgba(54, 113, 204, 0.14)",  // пастельный синий
  отправлен: "rgba(34, 197, 94, 0.15)"    // пастельный зелёный
};

function uniq(arr) {
  return [...new Set(arr)];
}

const ContainersTable = () => {
  const [data, setData] = useState(DUMMY_DATA);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("");
  const [status, setStatus] = useState("");
  const [track, setTrack] = useState("");
  const [date, setDate] = useState("");

  // Сбросить фильтры
  const resetFilters = () => {
    setSearch("");
    setDirection("");
    setStatus("");
    setTrack("");
    setDate("");
  };

  // Фильтрация
  const filtered = data.filter(
    (row) =>
      (!search || row.number.includes(search)) &&
      (!direction || row.direction === direction) &&
      (!status || row.status === status) &&
      (!track || row.track === track) &&
      (!date || row.date === date)
  );

  // Смена статуса (демо)
  const changeStatus = (id, newStatus) => {
    setData((old) =>
      old.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  // Группировка по дате
  const dates = uniq(filtered.map(r => r.date)).sort((a, b) => b.localeCompare(a));
  const grouped = dates.map(date => ({
    date,
    containers: filtered.filter(c => c.date === date)
  }));

  // Для фильтра по дате — уникальные даты из всего массива (не только отфильтрованные)
  const dateOptions = uniq(data.map(r => r.date)).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <h2 style={{ fontWeight: 600, fontSize: "1.6rem", marginBottom: 20 }}>🚚 Таблица контейнеров</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Поиск по номеру"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 180, borderRadius: 8, border: "1px solid #d1d5db" }}
        />
        <select value={direction} onChange={(e) => setDirection(e.target.value)} style={select}>
          <option value="">Все направления</option>
          <option value="европа">Европа</option>
          <option value="алматы">Алматы</option>
          <option value="узбекистан">Узбекистан</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={select}>
          <option value="">Все статусы</option>
          <option value="ожидание">Ожидание</option>
          <option value="прибыл">Прибыл</option>
          <option value="отправлен">Отправлен</option>
        </select>
        <select value={track} onChange={(e) => setTrack(e.target.value)} style={select}>
          <option value="">Все пути</option>
          <option value="узкий">Китайский путь (узкий)</option>
          <option value="широкий">Казахстанский путь (широкий)</option>
        </select>
        <select value={date} onChange={(e) => setDate(e.target.value)} style={select}>
          <option value="">Все даты</option>
          {dateOptions.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button onClick={resetFilters} style={{
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          background: "#f3f4f6",
          cursor: "pointer",
          fontWeight: 600
        }}>Сбросить фильтр</button>
      </div>

      {grouped.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", borderRadius: 16, background: "#f1f5f9", color: "#6b7280", marginTop: 32 }}>
          Нет контейнеров по заданным фильтрам
        </div>
      ) : (
        grouped.map(group => (
          <div key={group.date} style={{ marginBottom: 36 }}>
            <div style={{
              fontWeight: 700,
              fontSize: "1.18rem",
              background: "#F7F8FA",
              padding: "8px 22px",
              borderRadius: "14px 14px 0 0",
              marginTop: 18,
              marginBottom: 0,
              display: "inline-block"
            }}>
              🗓 {group.date}
            </div>
            <table style={{
              borderCollapse: "separate",
              borderSpacing: 0,
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 16px #0001"
            }}>
              <thead>
                <tr>
                  <th style={th}>№ Контейнер</th>
                  <th style={th}>Путь</th>
                  <th style={th}>Направление</th>
                  <th style={th}>Статус</th>
                  <th style={th}>Действие</th>
                </tr>
              </thead>
              <tbody>
                {group.containers.map((row, idx) => (
                  <tr key={row.id}
                    style={{
                      borderRadius: idx === group.containers.length - 1 ? "0 0 16px 16px" : 0,
                      background: idx % 2 ? "#F8F9FB" : "#fff"
                    }}>
                    <td style={td}>{row.number}</td>
                    <td style={{
                      ...td,
                      background: trackColors[row.track],
                      borderRadius: 7,
                      fontWeight: 600,
                      color: "#222"
                    }}>
                      {row.track === "узкий" ? "Узкий (Китай)" : "Широкий (Казахстан)"}
                    </td>
                    <td style={{
                      ...td,
                      background: directionColors[row.direction],
                      borderRadius: 7,
                      fontWeight: 600
                    }}>{row.direction}</td>
                    <td style={{
                      ...td,
                      background: statusColors[row.status],
                      borderRadius: 7,
                      fontWeight: 600
                    }}>{row.status}</td>
                    <td style={td}>
                      <select value={row.status} onChange={e => changeStatus(row.id, e.target.value)} style={{ padding: 4, borderRadius: 6 }}>
                        <option value="ожидание">Ожидание</option>
                        <option value="прибыл">Прибыл</option>
                        <option value="отправлен">Отправлен</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

const th = {
  border: "none",
  background: "#F7F8FA",
  padding: "10px 15px",
  fontWeight: 700,
  fontSize: "1rem",
  color: "#1e293b",
  borderTop: "1px solid #e5e7eb",
  borderBottom: "1px solid #e5e7eb"
};
const td = {
  border: "none",
  padding: "10px 12px",
  fontSize: "1rem",
  textAlign: "center"
};
const select = {
  padding: "8px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontWeight: 500
};

export default ContainersTable;