const ChatResponse = ({ response }) => {
  if (!response) return null;

  const candidates = response?.candidates || [];
  const usage = response?.usageMetadata;

  // Helper to extract text from various possible response shapes
  const extractText = (candidate) => {
    const parts = candidate?.content?.parts;
    if (Array.isArray(parts) && parts.length) {
      // join all text parts for robustness
      return parts
        .map((p) => (typeof p === "string" ? p : p?.text))
        .filter(Boolean)
        .join("\n\n");
    }
    // Fallbacks for other API shapes
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
    <div className="container my-4">
      <h3>Response</h3>

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
        <>
          <h4>Usage Metadata</h4>
          <p>Prompt Tokens: {usage?.promptTokenCount}</p>
          <p>Response Tokens: {usage?.candidatesTokenCount}</p>
          <p>Total Tokens: {usage?.totalTokenCount}</p>
        </>
      ) : null}
    </div>
  );
};

export default ChatResponse;
