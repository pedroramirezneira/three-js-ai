import { useState } from "react";

interface ChatProps {
  onSend: (message: string) => void;
}

export default function Chat({ onSend }: ChatProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: 300,
        background: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 10,
        color: "#fff",
        display: "flex",
        gap: 5,
      }}
    >
      <input
        style={{ flex: 1, padding: 5, borderRadius: 5, border: "none" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe algo..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} style={{ padding: "5px 10px" }}>
        Enviar
      </button>
    </div>
  );
}
