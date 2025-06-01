import { useState } from "react";
import { experimentsData } from "./data";

export default function App() {
  const [selectedExpId, setSelectedExpId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const onExpClick = (id) => {
    setSelectedExpId(id);
    setSelectedSubId(null);
  };

  const onSubClick = (id) => {
    setSelectedSubId(id === selectedSubId ? null : id);
  };

  if (selectedExpId === null) {
    return (
      <div style={{ padding: "10px" }}>
        <h2>Lab Practical Experiments</h2>
        <ul style={{ paddingLeft: 0 }}>
          {experimentsData.map((exp) => (
            <li
              key={exp.id}
              style={{ cursor: "pointer", marginBottom: "8px", listStyle: "none" }}
              onClick={() => onExpClick(exp.id)}
            >
              {exp.title}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const exp = experimentsData.find((e) => e.id === selectedExpId);

  return (
    <div style={{ padding: "10px" }}>
      <button onClick={() => { setSelectedExpId(null); setSelectedSubId(null); }} style={{ marginBottom: "15px" }}>
        &lt; Back to Experiments
      </button>

      <h2>{exp.title}</h2>

      {exp.subdivisions ? (
        <div>
          <h3>Subdivisions</h3>
          <ul style={{ paddingLeft: 0 }}>
            {exp.subdivisions.map((sub) => (
              <li
                key={sub.id}
                style={{ cursor: "pointer", marginBottom: "5px", listStyle: "none" }}
                onClick={() => onSubClick(sub.id)}
              >
                {sub.title}
              </li>
            ))}
          </ul>

          {selectedSubId && (
            <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "10px" }}>
              {exp.subdivisions.find((s) => s.id === selectedSubId).content}
            </pre>
          )}
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "10px" }}>
          {exp.content}
        </pre>
      )}
    </div>
  );
}
