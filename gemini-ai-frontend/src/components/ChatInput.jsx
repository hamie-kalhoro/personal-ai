import { useState } from "react";

const ChatInput = ({ onSubmit, onEmptySubmit, loading = false }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion("");
    } else {
      onEmptySubmit && onEmptySubmit();
    }
  };

  return (
    <div className="search-area">
      <form onSubmit={handleSubmit}>
        {/* Label + search bar grouped to align perfectly */}
        <div className="mb-0 mx-auto" style={{ maxHeight: 80, maxWidth: 600 }}>
          <label
            htmlFor="question"
            className="form-label mb-2 text-white d-flex align-items-center justify-content-center gap-2 search-label">
            <img
              src="/shark_image_updated.png"
              alt="App logo"
              className="brand-icon-sm"
            />
            <span className="search-label-title">Leather Style</span>
          </label>

          <div className="position-relative">
            <textarea
              className="form-control glass-input rounded-pill pe-5 search-border-animated"
              id="question"
              placeholder="Ask any question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              style={{
                height: "45px",
                paddingRight: "92px",
                paddingLeft: "16px",
                resize: "none",
              }}
            />

            <button
              type="submit"
              aria-label="Search"
              className={`btn btn-primary glass-btn-primary rounded-pill position-absolute end-0 top-50 translate-middle-y me-2 d-flex align-items-center gap-1 ${
                loading ? "is-loading" : ""
              }`}
              style={{ height: 32, paddingInline: 10 }}
              disabled={loading}>
              {loading ? (
                <span className="glass-spinner-bars" aria-hidden="true">
                  {[...Array(12)].map((_, i) => (
                    <span
                      className="seg"
                      key={i}
                      style={{
                        transform: `translate(-50%, -50%) rotate(${
                          i * 30
                        }deg) translateY(-7px)`,
                        animationDelay: `${i * 0.09}s`,
                      }}
                    />
                  ))}
                </span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
