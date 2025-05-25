import React, { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CRANES = 3;
const ROWS = 4;      // Этажи (высота)
const STACKS = 10;   // Ряды (стэки)
const COLS = 25;     // Длина (позиции под контейнеры)

const DIRECTION_COLORS = {
  европа: "#059669",
  алматы: "#CA8A04",
  узбекистан: "#B91C1C"
};

const ALL_DIRECTIONS = ["европа", "алматы", "узбекистан"];

function generateCraneYard(craneIdx) {
  const yard = Array.from({ length: ROWS }, () =>
    Array.from({ length: STACKS }, () =>
      Array(COLS).fill(null)
    )
  );
  let counter = 0;
  for (let i = 0; i < 35; i++) {
    const row = Math.floor(Math.random() * ROWS);
    const stack = Math.floor(Math.random() * STACKS);
    const col = Math.floor(Math.random() * COLS);
    if (!yard[row][stack][col]) {
      yard[row][stack][col] = {
        number: String(craneIdx + 1) + String(10000000 + Math.floor(Math.random() * 90000000)),
        direction: ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)],
      };
      counter++;
    }
  }
  return yard;
}

function getInitYards() {
  return Array.from({ length: CRANES }, (_, i) => generateCraneYard(i));
}

export default function CraneInterface() {
  const [yards, setYards] = useState(getInitYards);
  const [selectedCrane, setSelectedCrane] = useState(0);

  const [filterDirection, setFilterDirection] = useState("");
  const [filterNumber, setFilterNumber] = useState("");

  const filteredYard = useMemo(() => {
    const yard = yards[selectedCrane];
    return yard.map(layer => 
      layer.map(stack => 
        stack.map(cell => {
          if (!cell) return null;
          if (filterDirection && cell.direction !== filterDirection) return null;
          if (filterNumber && !cell.number.includes(filterNumber)) return null;
          return cell;
        })
      )
    );
  }, [yards, selectedCrane, filterDirection, filterNumber]);

  const idFromPos = (row, stack, col) => `${row}-${stack}-${col}`;
  const posFromId = (id) => id.split('-').map(Number);

  function isOnTopOfGreen(yard, toRow, stackIdx, colIdx) {
    const destinationCell = yard[toRow][stackIdx][colIdx];
    return destinationCell && destinationCell.direction === "европа";
  }

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const [fromRow, fromStack, fromCol] = posFromId(result.source.droppableId);
    const [toRow, toStack, toCol] = posFromId(result.destination.droppableId);
    if (fromRow === toRow && fromStack === toStack && fromCol === toCol) return;

    const yard = yards[selectedCrane];
    const curr = yard[fromRow][fromStack][fromCol];
    if (yard[toRow][toStack][toCol]) return;
    if (isOnTopOfGreen(yard, toRow, toStack, toCol)) return;

    const nextYard = yard.map((rowArr, r) =>
      rowArr.map((stackArr, s) =>
        stackArr.map((cell, c) => {
          if (r === fromRow && s === fromStack && c === fromCol) return null;
          if (r === toRow && s === toStack && c === toCol) return curr;
          return cell;
        })
      )
    );
    const updatedYards = [...yards];
    updatedYards[selectedCrane] = nextYard;
    setYards(updatedYards);
  };

  const handleCraneChange = (idx) => {
    setSelectedCrane(idx);
    setFilterDirection("");
    setFilterNumber("");
  };

  // Основной рендер: по рядам, внутри — этажи сверху вниз
  function renderRows() {
    return Array.from({ length: STACKS }).map((_, stackIdx) => (
      <div key={stackIdx} style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 16, margin: "18px 0 10px 0", color: "#6366f1" }}>
          Ряд {stackIdx + 1}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Array.from({ length: ROWS }).map((_, rowIdx) => {
            // Этажи сверху вниз: 4,3,2,1
            const realRow = ROWS - rowIdx - 1;
            return (
              <div key={realRow} style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <div
                  style={{
                    width: 70,
                    textAlign: "right",
                    fontSize: 14,
                    color: "#888",
                    marginRight: 6
                  }}
                >
                  Этаж {realRow + 1}
                </div>
                {Array.from({ length: COLS }).map((_, colIdx) => {
                  const cell = filteredYard[realRow][stackIdx][colIdx];
                  const droppableId = idFromPos(realRow, stackIdx, colIdx);
                  return (
                    <Droppable droppableId={droppableId} key={droppableId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            width: 42,
                            height: 42,
                            margin: 1.5,
                            background: snapshot.isDraggingOver ? "#c7d2fe" : "#e5e7eb",
                            border: cell ? `2px solid ${DIRECTION_COLORS[cell?.direction] || "#94a3b8"}` : "1px solid #d1d5db",
                            borderRadius: 7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                          }}>
                          {cell ? (
                            <Draggable draggableId={droppableId} index={0}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    background: DIRECTION_COLORS[cell.direction] || "#cbd5e1",
                                    color: "#fff",
                                    borderRadius: 7,
                                    fontWeight: 700,
                                    fontSize: 13,
                                    boxShadow: snapshot.isDragging ? "0 0 8px #6366f1" : undefined,
                                    opacity: snapshot.isDragging ? 0.85 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    ...provided.draggableProps.style
                                  }}
                                  title={`№${cell.number}, направление: ${cell.direction}`}
                                >
                                  {cell.number}
                                </div>
                              )}
                            </Draggable>
                          ) : null}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    ));
  }

  return (
    <div style={{ fontFamily: "'Rubik',sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>
      <h2 style={{ fontWeight: 600, fontSize: "1.5rem", margin: "0 0 1rem 0" }}>🛠 Перемещение контейнеров (Drag & Drop)</h2>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Краны:</div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: CRANES }).map((_, idx) => (
              <button
                key={idx}
                style={{
                  padding: "4px 16px",
                  background: idx === selectedCrane ? "#6366f1" : "#f3f4f6",
                  color: idx === selectedCrane ? "#fff" : "#222",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                onClick={() => handleCraneChange(idx)}
              >
                Кран {idx + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Фильтрация:</div>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={filterDirection}
              onChange={e => setFilterDirection(e.target.value)}
              style={{ padding: "4px 10px", border: "1px solid #ccc", borderRadius: 5 }}
            >
              <option value="">Все направления</option>
              {ALL_DIRECTIONS.map(dir => (
                <option value={dir} key={dir}>{dir}</option>
              ))}
            </select>
            <input
              value={filterNumber}
              onChange={e => setFilterNumber(e.target.value)}
              placeholder="Поиск по номеру"
              style={{ padding: "4px 10px", border: "1px solid #ccc", borderRadius: 5 }}
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {renderRows()}
      </DragDropContext>
    </div>
  );
}