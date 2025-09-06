const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container py-10 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} TravelPerk Pro</p>
        <nav className="flex items-center gap-6">
          <a className="story-link" href="#privacy">Privacy</a>
          <a className="story-link" href="#terms">Terms</a>
          <a className="story-link" href="#security">Security</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
