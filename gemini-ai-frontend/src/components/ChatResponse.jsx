const renderInlineMarkdown = (text) => {
  if (!text) return text;

  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments.map((segment, index) => {
    const boldMatch = segment.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={index}>{boldMatch[1]}</strong>;
    }
    return segment;
  });
};

const renderMarkdown = (text) => {
  if (!text) return <p className="response-markdown-paragraph">No response content available.</p>;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const codeFenceMatch = line.match(/^```(\w+)?\s*$/);
    if (codeFenceMatch) {
      const language = codeFenceMatch[1] || "";
      i += 1;
      const codeLines = [];
      while (i < lines.length && !lines[i].match(/^```\s*$/)) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;

      blocks.push(
        <pre className="response-markdown-code" key={`code-${blocks.length}`}>
          <code data-language={language || undefined}>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(6, headingMatch[1].length);
      const HeadingTag = `h${level}`;
      blocks.push(
        <HeadingTag className="response-markdown-heading" key={`heading-${blocks.length}`}>
          {renderInlineMarkdown(headingMatch[2])}
        </HeadingTag>
      );
      i += 1;
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      const items = [];
      while (i < lines.length) {
        const itemMatch = lines[i].match(/^(\d+)\.\s+(.+)$/);
        if (!itemMatch) break;
        items.push(itemMatch[2]);
        i += 1;
      }
      blocks.push(
        <ol className="response-markdown-list ordered" key={`ol-${blocks.length}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const unorderedMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (unorderedMatch) {
      const items = [];
      while (i < lines.length) {
        const itemMatch = lines[i].match(/^\s*[-*]\s+(.+)$/);
        if (!itemMatch) break;
        items.push(itemMatch[1]);
        i += 1;
      }
      blocks.push(
        <ul className="response-markdown-list unordered" key={`ul-${blocks.length}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const paragraphLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].match(/^```(\w+)?\s*$/) &&
      !lines[i].match(/^(#{1,6})\s+(.+)$/) &&
      !lines[i].match(/^(\d+)\.\s+(.+)$/) &&
      !lines[i].match(/^\s*[-*]\s+(.+)$/)
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push(
      <p className="response-markdown-paragraph" key={`p-${blocks.length}`}>
        {renderInlineMarkdown(paragraphLines.join(" "))}
      </p>
    );
  }

  return blocks.length
    ? blocks
    : <p className="response-markdown-paragraph">No response content available.</p>;
};

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
              <div className="card-text response-markdown">
                {renderMarkdown(extractText(candidate))}
              </div>

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
            <div className="card-text response-markdown">
              {renderMarkdown(fallbackText)}
            </div>
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
