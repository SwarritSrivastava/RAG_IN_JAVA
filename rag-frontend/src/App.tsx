import { useState } from "react";
import LiquidEther from './LiquidEther.tsx';

function App() {
  // Add missing handleAsk function inside App
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "assistant"; text: string }[]>([]);

  const handleAsk = async () => {
    if (message.trim() === "") return;
    setChat([...chat, { role: "user", text: message }]);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/ai/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setChat(prev => [...prev, { role: "assistant", text: data.answer || "No response" }]);
    } catch (err) {
      setChat(prev => [...prev, { role: "assistant", text: "Error: Could not get response from server." }]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8080/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
  };
  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
        background: "linear-gradient(120deg, #181a20 0%, #23272f 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        fontSize: "1.25rem"
      }}
    >
      <aside style={{
        width: "40vw",
        minWidth: 340,
        maxWidth: 520,
        background: "#22252b",
        color: "#f3f6fa",
        padding: "3.5rem 2.5rem 2.5rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 0 24px #181a20",
        zIndex: 2,
        fontSize: "1.35rem"
      }}>
        <div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, color: "#00e6d6", marginBottom: "1.2rem", letterSpacing: "2px", textShadow: "0 2px 12px #00e6d6" }}>
            RAG Demo
          </h1>
          <h2 style={{ fontSize: "1.35rem", color: "#ff4fa2", marginBottom: "2.5rem", fontWeight: 600 }}>PDF AI Assistant</h2>
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ color: "#00e6d6", fontWeight: 700, marginBottom: "0.7rem", fontSize: "1.25rem" }}>Features</h3>
            <ul style={{ fontSize: "1.15rem", lineHeight: 1.8, paddingLeft: "1.2rem", color: "#e0e3e8" }}>
              <li>Upload and analyze PDF documents</li>
              <li>Chat with AI about your documents</li>
              <li>Fast, secure, and private</li>
              <li>Beautiful, responsive UI</li>
              <li>Powered by Retrieval Augmented Generation</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: "auto", fontSize: "1.2rem", color: "#ff4fa2", textAlign: "left" }}>
          <span>Made by <b>mrfarts</b></span>
        </div>
      </aside>
      <div style={{
        flex: 1,
        minWidth: 440,
        maxWidth: "60vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        padding: "3rem 2.5rem 2.5rem 2.5rem",
        gap: "2.5rem",
        fontSize: "1.25rem"
      }}>
        <header style={{
          width: "100%",
          padding: "0.7rem 0 1.2rem 0",
          color: "#00e6d6",
          fontWeight: 700,
          fontSize: "1.7rem",
          letterSpacing: "2px",
          textAlign: "center",
          marginBottom: "1.2rem"
        }}>
          Welcome to your PDF AI Assistant
        </header>
        <section className="upload-section" style={{
          background: "#23272f",
          borderRadius: 18,
          boxShadow: "0 4px 24px #00e6d655, 0 2px 24px #ff4fa233",
          border: "2px solid #22252b",
          padding: "2.2rem 1.7rem",
          marginBottom: "2rem"
        }}>
          <h2 style={{ color: "#ff4fa2", marginBottom: "1rem", textShadow: "0 2px 8px #ff4fa2", fontSize: "1.25rem" }}>Upload PDF</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
            <label htmlFor="file-upload" style={{
              background: "linear-gradient(90deg, #00e6d6 0%, #ff4fa2 100%)",
              color: "#111",
              border: "none",
              borderRadius: 10,
              padding: "0.8rem 2.2rem",
              fontWeight: 600,
              fontSize: "1.15rem",
              boxShadow: "0 2px 8px #00e6d644",
              cursor: "pointer",
              transition: "0.2s",
              display: "inline-block"
            }}>
              Browse
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            {file && <span style={{ color: "#00e6d6", fontSize: "1.05rem" }}>{file.name}</span>}
            <button onClick={handleUpload} style={{
              background: "linear-gradient(90deg, #00e6d6 0%, #ff4fa2 100%)",
              color: "#111",
              border: "none",
              borderRadius: 10,
              padding: "0.8rem 2.2rem",
              fontWeight: 600,
              fontSize: "1.15rem",
              boxShadow: "0 2px 8px #00e6d644",
              cursor: "pointer",
              transition: "0.2s"
            }}>
              Upload
            </button>
          </div>
        </section>
        <section className="input-section" style={{
          background: "#23272f",
          borderRadius: 18,
          boxShadow: "0 4px 24px #00e6d655, 0 2px 24px #ff4fa233",
          border: "2px solid #22252b",
          padding: "2.2rem 1.7rem",
          marginBottom: "2rem"
        }}>
          <h2 style={{ color: "#00e6d6", marginBottom: "1rem", textShadow: "0 2px 8px #00e6d6", fontSize: "1.25rem" }}>Chat</h2>
          <div style={{
            background: "#23272f",
            borderRadius: 14,
            padding: "1.2rem",
            minHeight: "260px",
            maxHeight: "380px",
            overflowY: "auto",
            marginBottom: "1.2rem",
            boxShadow: "0 1px 8px #00e6d622"
          }}>
            {chat.length === 0 && (
              <div style={{ color: "#888", textAlign: "center", marginTop: "2.5rem", fontSize: "1.15rem" }}>Start the conversation...</div>
            )}
            {chat.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "0.7rem"
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.9rem 1.2rem",
                    borderRadius: 14,
                    background: msg.role === "user"
                      ? "linear-gradient(90deg, #00e6d6 0%, #ff4fa2 100%)"
                      : "#23272f",
                    color: msg.role === "user" ? "#111" : "#ff4fa2",
                    fontWeight: 500,
                    fontSize: "1.15rem",
                    boxShadow: msg.role === "user"
                      ? "0 2px 8px #00e6d644"
                      : "0 2px 8px #ff4fa244"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.7rem" }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "0.9rem",
                borderRadius: 10,
                border: "1.5px solid #ff4fa2",
                fontSize: "1.15rem",
                background: "#22252b",
                color: "#ff4fa2",
                boxShadow: "0 1px 8px #ff4fa222"
              }}
            />
            <button 
              onClick={handleAsk} 
              style={{
                background: "linear-gradient(90deg, #ff4fa2 0%, #00e6d6 100%)",
                color: "#111",
                border: "none",
                borderRadius: 10,
                padding: "0.9rem 2.2rem",
                fontWeight: 600,
                fontSize: "1.15rem",
                boxShadow: "0 2px 8px #ff4fa244",
                cursor: "pointer",
                transition: "0.2s"
              }}
            >
              Send
            </button>
          </div>
        </section>
        <footer style={{ textAlign: "center", color: "#00e6d6", marginTop: "1.5rem", fontSize: "1.1rem", textShadow: "0 1px 4px #ff4fa2", padding: "1.2rem 0" }}>
          <span>Made with <span style={{ color: "#ff4fa2" }}>❤</span> using React & Vite</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
