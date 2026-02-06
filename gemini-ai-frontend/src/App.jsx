import { useState, useEffect, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatInput from "./components/ChatInput.jsx";
import ChatResponse from "./components/ChatResponse.jsx";
import Footer from "./components/Footer.jsx";
import { fetchChatResponse } from "./services/api.jsx";
import sunIcon from "./assets/sun.svg";
import moonIcon from "./assets/moon.svg";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warn, setWarn] = useState("");
  const [warnDismissing, setWarnDismissing] = useState(false);
  const [respDismissing, setRespDismissing] = useState(false);
  const [errorDismissing, setErrorDismissing] = useState(false);
  const fullTitle = "Hamidz Ai";
  const [typedIndex, setTypedIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [theme, setTheme] = useState("dark");

  // Auto-dismiss error toast after 3 seconds
  // Auto-dismiss error toast with a fall-out animation
  useEffect(() => {
    if (!error) return;
    setErrorDismissing(false);
    const showTimer = setTimeout(() => {
      setErrorDismissing(true);
      const clearTimer = setTimeout(() => setError(""), 700);
      return () => clearTimeout(clearTimer);
    }, 2400);
    return () => clearTimeout(showTimer);
  }, [error]);

  // Auto-dismiss warning toast with a fall-out animation
  useEffect(() => {
    if (!warn) return;
    setWarnDismissing(false);
    const showTimer = setTimeout(() => {
      setWarnDismissing(true); // trigger fall-out
      const clearTimer = setTimeout(() => setWarn(""), 700); // remove after animation
      return () => clearTimeout(clearTimer);
    }, 2400);
    return () => clearTimeout(showTimer);
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
      // Reflect theme on root html for page-level scrollbars
      const root = document.documentElement;
      root.classList.remove("theme-light");
      root.classList.add("theme-dark");
    } catch {}
  }, []);

  // Toggle theme and persist
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
        // Reflect theme on root html for page-level scrollbars
        const root = document.documentElement;
        root.classList.remove("theme-dark", "theme-light");
        root.classList.add(`theme-${next}`);
      } catch {}
      return next;
    });
  };

  const handleQuestionSubmit = async (question) => {
    setError("");
    // If a response is on screen, animate it falling out before clearing
    if (response) {
      setLoading(true);
      setRespDismissing(true);
      await new Promise((r) => setTimeout(r, 650));
      setResponse(null);
      setRespDismissing(false);
    } else {
      setLoading(true);
    }

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
  const headerRef = useRef(null);
  const [layout, setLayout] = useState({ navBottom: 120, searchHeight: 100 });

  // Measure navbar bottom and search bar height to size the response section
  useEffect(() => {
    const measure = () => {
      try {
        const navRect = headerRef.current?.getBoundingClientRect();
        const searchEl = document.querySelector(".search-area");
        const searchRect = searchEl?.getBoundingClientRect();
        setLayout({
          navBottom: (navRect?.bottom ?? 120) + 12,
          searchHeight: (searchRect?.height ?? 100) + 16,
        });
      } catch {}
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className={`App bg-dots-glass theme-${theme}`}>
      <header
        className={`glass-nav glass-nav-liquid ${headerTextClass} text-start py-3 pt-2 px-3 rounded-5`}
        style={{
          marginTop: "0",
          marginLeft: "15px",
          marginRight: "15px",
          position: "relative",
          top: "15px",
        }}
        ref={headerRef}>
        <div
          className="container d-flex align-items-center justify-content-between"
          style={{ paddingTop: "0", marginTop: "0" }}>
          <h3
            className="m-0 title-color-animated d-flex align-items-center gap-2"
            style={{ paddingTop: "0", marginTop: "0" }}>
            <img
              src="/shark_image_updated.png"
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
              <img src={sunIcon} alt="Sun" width={18} height={18} />
            ) : (
              <img src={moonIcon} alt="Moon" width={18} height={18} />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
        {error && (
          <div
            className={`error-toast ${errorDismissing ? "fall-out" : ""}`}
            role="alert"
            aria-live="assertive">
            <div className="error-toast-content">{error}</div>
          </div>
        )}
        {warn && (
          <div
            className={`warning-toast ${warnDismissing ? "fall-out" : ""}`}
            role="status"
            aria-live="polite">
            <div className="warning-toast-content">{warn}</div>
          </div>
        )}
      </header>
      {/* Helper tag centered, shows only when there's no response */}
      {!response && !loading && (
        <div className="help-tag" aria-label="Helper prompt">
          How can i help you
          <span className="help-tag-qmark" aria-hidden="true">
            ?
          </span>
        </div>
      )}

      {/* Centered response section spanning between navbar and search bar */}
      {response && (
        <section
          className="response-section"
          style={{ top: layout.navBottom, bottom: layout.searchHeight }}>
          <ChatResponse response={response} dismissing={respDismissing} />
        </section>
      )}
      <ChatInput
        loading={loading}
        onSubmit={handleQuestionSubmit}
        onEmptySubmit={() => {
          setWarn("Tell me what's on your mind");
          setWarnDismissing(false);
        }}
      />
      {loading && (
        <div
          className="loading-tag"
          role="status"
          aria-live="polite"
          aria-label="Loading in progress">
          Loading...
        </div>
      )}
      {/* Response is rendered inside response-section above */}
      <Footer />
    </div>
  );
}

export default App;
