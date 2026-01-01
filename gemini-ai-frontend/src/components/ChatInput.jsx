import { useState } from "react";

const ChatInput = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion("");
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit}>
        {/* Label + search bar grouped to align perfectly */}
        <div className="mb-3 mx-auto" style={{ maxWidth: 600 }}>
          <label htmlFor="question" className="form-label mb-2">
            Ask a Question
          </label>

          <div className="position-relative">
            <input
              type="text"
              className="form-control rounded-pill pe-5"
              id="question"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ paddingRight: "80px" }}
            />

            <button
              type="submit"
              aria-label="Search"
              className="btn btn-primary rounded-pill position-absolute end-0 top-50 translate-middle-y me-1 d-flex align-items-center gap-1"
              style={{ height: 32, paddingInline: 10 }}>
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
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
