const ChatResponse = ({ response, dismissing = false }) => {
  if (!response) return null;

  const candidates = response?.candidates || [];
  const usage = response?.usageMetadata;

  // Helper to extract text from various possible response shapes
  const extractText = (candidate) => {
    const parts = candidate?.content?.parts;
    if (Array.isArray(parts) && parts.length) {
      return parts
        .map((p) => (typeof p === "string" ? p : p?.text))
        .filter(Boolean)
        .join("\n\n");
    }
    if (candidate?.content?.text) return candidate.content.text;
    if (candidate?.output_text) return candidate.output_text;
    return JSON.stringify(candidate);
  };

  const hasCandidates = candidates.length > 0;
  const fallbackText =
    response?.text ||
    response?.output_text ||
    (typeof response?.content === "string" ? response.content : null);

  return (
    <div className={`chat-response ${dismissing ? "fall-out" : ""}`}>
      <h3 className="response-title">Response</h3>

      {/* Inline error removed to avoid duplicate with navbar toast */}

      {hasCandidates ? (
        candidates.map((candidate, index) => (
          <div className="card mb-3" key={index}>
            <div className="card-body">
              <h5 className="card-title">Candidate {index + 1}</h5>
              <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                {extractText(candidate)}
              </p>

              {candidate?.citationMetadata?.citationSources?.length ? (
                <>
                  <h6>Citations:</h6>
                  <ul>
                    {candidate.citationMetadata.citationSources.map(
                      (source, idx) => (
                        <li key={idx}>
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer">
                            {source.uri}
                          </a>{" "}
                          (Indexes: {source.startIndex} - {source.endIndex})
                        </li>
                      )
                    )}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <div className="card-body">
            <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
              {fallbackText || "No response content available."}
            </p>
          </div>
        </div>
      )}

      {usage ? (
        <div className="usage-metadata">
          <h4>Usage Metadata</h4>
          <p>Prompt Tokens: {usage?.promptTokenCount}</p>
          <p>Response Tokens: {usage?.candidatesTokenCount}</p>
          <p>Total Tokens: {usage?.totalTokenCount}</p>
        </div>
      ) : null}
    </div>
  );
};

export default ChatResponse;
