const Footer = () => {
  // Names with hidden URLs (not shown in UI, only names appear)
  const links = [
    { name: "Alice", url: "https://example.com/alice" },
    { name: "Bob", url: "https://example.com/bob" },
    { name: "Charlie", url: "https://example.com/charlie" },
  ];

  return (
    <footer className="app-footer text-center text-white py-2">
      <div className="container d-flex justify-content-center gap-3 flex-wrap">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.url}
            className="footer-link"
            rel="noopener noreferrer">
            {l.name}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
