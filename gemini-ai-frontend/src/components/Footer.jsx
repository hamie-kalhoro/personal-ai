const Footer = () => {
  // Names with hidden URLs (not shown in UI, only names appear)
  const links = [
    { name: "Alice", url: "https://example.com/alice" },
    { name: "Bob", url: "https://example.com/bob" },
    { name: "Charlie", url: "https://example.com/charlie" },
  ];

  return (
    <footer className="app-footer text-center text-white py-0">
      <div className="container d-flex justify-content-center gap-2 flex-wrap">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.url}
            className="footer-pill"
            rel="noopener noreferrer"
            aria-label={`Visit ${l.name}`}>
            {l.name}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
