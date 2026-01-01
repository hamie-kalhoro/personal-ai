import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatInput from "./components/ChatInput.jsx";
import ChatResponse from "./components/ChatResponse.jsx";
import { fetchChatResponse } from "./services/api.jsx";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="App">
      <header className="bg-primary text-white text-center py-4">
        <h3>Hamidz Ai</h3>
      </header>
      <ChatInput onSubmit={handleQuestionSubmit} />
      {error && (
        <div className="container my-3">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}
      {loading && <h3>Loading...</h3>}
      <ChatResponse response={response} />
      {/* RESPONSE */}
    </div>
  );
}

export default App;
