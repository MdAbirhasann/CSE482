import Button from './Button.jsx';

export default function Navbar({ isDarkMode, onToggleTheme, visibleSections, onToggleSection }) {
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="navbar">
      <a className="logo" href="#hero" aria-label="Go to hero section">
        MyPortfolio
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          visibleSections[item.id] && (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          )
        ))}
      </nav>

      <div className="nav-actions" aria-label="Page controls">
        {navItems.map((item) => (
          <Button key={item.id} variant="ghost" onClick={() => onToggleSection(item.id)}>
            {visibleSections[item.id] ? `Hide ${item.label}` : `Show ${item.label}`}
          </Button>
        ))}

        <Button variant="secondary" onClick={onToggleTheme}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </header>
  );
}
