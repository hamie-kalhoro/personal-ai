const Footer = () => {
  // Names with hidden URLs (not shown in UI, only names appear)
  const links = [
    { name: "About", url: "https://example.com/alice" },
    { name: "Github", url: "https://github.com/hamie-kalhoro" },
    { name: "Portfolio", url: "https://hamids-portfolio.vercel.app/" },
  ];

  const Icon = ({ name }) => {
    switch (name) {
      case "About":
        return (
          <svg
            className="footer-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="7.5" r="1.25" fill="currentColor" />
            <path
              d="M12 10v7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "Github":
        return (
          <svg
            className="footer-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        );
      case "Portfolio":
        return (
          <svg
            className="footer-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M9 7V5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="app-footer text-center text-white py-0">
      <div className="container-fluid footer-grid">
        <div className="footer-center-group d-flex justify-content-center gap-2 flex-wrap">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.url}
              className="footer-pill"
              rel="noopener noreferrer"
              aria-label={`Visit ${l.name}`}>
              <Icon name={l.name} />
              <span className="footer-label">{l.name}</span>
            </a>
          ))}
        </div>
        <span
          className="footer-pill footer-pill-static"
          aria-label="Copyright notice">
          © 2026 Hamid Ali. All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
