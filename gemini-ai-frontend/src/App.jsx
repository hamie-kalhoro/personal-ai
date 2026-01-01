import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatInput from "./components/ChatInput.jsx";
import ChatResponse from "./components/ChatResponse.jsx";
import Footer from "./components/Footer.jsx";
import { fetchChatResponse } from "./services/api.jsx";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warn, setWarn] = useState("");

  // Auto-dismiss error toast after 3 seconds
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(t);
  }, [error]);

  // Auto-dismiss warning toast after 3 seconds
  useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(""), 3000);
    return () => clearTimeout(t);
  }, [warn]);

  const handleQuestionSubmit = async (question) => {
    setLoading(true);
    setResponse(null);
    setError("");
    try {
      const apiResponse = await fetchChatResponse(question);
      setResponse(apiResponse);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to get response"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App bg-dots-glass">
      <header
        className="glass-nav text-white text-start py-3 pt-3 px-3 rounded-5"
        style={{
          marginTop: "0",
          marginLeft: "15px",
          marginRight: "15px",
          position: "relative",
          top: "15px",
        }}>
        <div className="container" style={{ paddingTop: "0", marginTop: "0" }}>
          <h3
            className="m-0 title-color-animated"
            style={{ paddingTop: "0", marginTop: "0" }}>
            Hamidz Ai
          </h3>
        </div>
        {error && (
          <div className="error-toast" role="alert" aria-live="assertive">
            <div className="error-toast-content">{error}</div>
          </div>
        )}
        {warn && (
          <div className="warning-toast" role="status" aria-live="polite">
            <div className="warning-toast-content">{warn}</div>
          </div>
        )}
      </header>
      <ChatInput
        onSubmit={handleQuestionSubmit}
        onEmptySubmit={() => setWarn("Tell me what's on your mind")}
      />
      {loading && <h3>Loading...</h3>}
      <ChatResponse response={response} />
      <Footer />
    </div>
  );
}

export default App;
