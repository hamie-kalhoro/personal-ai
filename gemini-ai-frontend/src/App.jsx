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
  const fullTitle = "Hamidz Ai";
  const [typedIndex, setTypedIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [theme, setTheme] = useState("dark");

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

  const TYPE_DELAY_MS = 200; // typing speed per character
  const COLORS = ["#67C4FF", "#FFD301", "#E91C12", "#AEE938", "#FF8C00"];
  const [colorIndex, setColorIndex] = useState(0);

  // Looping typewriter effect for the header title
  useEffect(() => {
    let delay = TYPE_DELAY_MS;
    let timer;
    if (typedIndex < fullTitle.length) {
      timer = setTimeout(() => {
        setDisplayedTitle(fullTitle.slice(0, typedIndex + 1));
        setTypedIndex((i) => i + 1);
      }, delay);
    } else {
      // Pause at full title, then restart
      delay = 1200;
      timer = setTimeout(() => {
        setDisplayedTitle("");
        setTypedIndex(0);
        setColorIndex((i) => (i + 1) % COLORS.length);
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [typedIndex, fullTitle]);

  // Update CSS var to reflect current color for title and search bar
  useEffect(() => {
    const current = COLORS[colorIndex];
    document.documentElement.style.setProperty("--current-color", current);
  }, [colorIndex]);

  // Always start in dark theme on load (override any saved value)
  useEffect(() => {
    setTheme("dark");
    try {
      localStorage.setItem("theme", "dark");
    } catch {}
  }, []);

  // Toggle theme and persist
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  };

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

  const headerTextClass = theme === "dark" ? "text-white" : "text-dark";

  return (
    <div className={`App bg-dots-glass theme-${theme}`}>
      <header
        className={`glass-nav glass-nav-liquid ${headerTextClass} text-start py-3 pt-3 px-3 rounded-5`}
        style={{
          marginTop: "0",
          marginLeft: "15px",
          marginRight: "15px",
          position: "relative",
          top: "15px",
        }}>
        <div
          className="container d-flex align-items-center justify-content-between"
          style={{ paddingTop: "0", marginTop: "0" }}>
          <h3
            className="m-0 title-color-animated d-flex align-items-center gap-2"
            style={{ paddingTop: "0", marginTop: "0" }}>
            <img
              src="/original_logo.png"
              alt="App logo"
              className="brand-icon"
            />
            <span aria-label={fullTitle}>{displayedTitle}</span>
          </h3>
          <button
            type="button"
            className="btn glass-btn-primary btn-toggle rounded-pill d-flex align-items-center gap-2"
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme">
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
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
