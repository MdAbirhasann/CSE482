import Navbar from '../components/Navbar.jsx';

export default function MainLayout({ children, isDarkMode, onToggleTheme, visibleSections, onToggleSection }) {
  return (
    <div className={isDarkMode ? 'app dark' : 'app light'}>
      <Navbar
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        visibleSections={visibleSections}
        onToggleSection={onToggleSection}
      />
      <main>{children}</main>
    </div>
  );
}
