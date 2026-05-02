import { useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import ContactForm from '../components/ContactForm.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import { initialProjects } from '../data/projects.js';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [headlineRole, setHeadlineRole] = useState('Frontend Developer');
  const [projects, setProjects] = useState(initialProjects);
  const [alertMessage, setAlertMessage] = useState('');
  const [visibleSections, setVisibleSections] = useState({
    about: true,
    projects: true,
    contact: true
  });

  const totalTags = useMemo(() => {
    const uniqueTags = new Set(projects.flatMap((project) => project.tags));
    return uniqueTags.size;
  }, [projects]);

  function toggleTheme() {
    setIsDarkMode((currentMode) => !currentMode);
  }

  function toggleSection(sectionName) {
    setVisibleSections((currentSections) => ({
      ...currentSections,
      [sectionName]: !currentSections[sectionName]
    }));
  }

  function showAlert(message) {
    setAlertMessage(message);
    window.alert(message);
  }

  function addProject(project) {
    const newProject = {
      ...project,
      id: crypto.randomUUID()
    };

    setProjects((currentProjects) => [newProject, ...currentProjects]);
    showAlert('Project added successfully.');
  }

  function removeProject(projectId) {
    setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
    showAlert('Project removed successfully.');
  }

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
      visibleSections={visibleSections}
      onToggleSection={toggleSection}
    >
      <section id="hero" className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">React + Vite Portfolio</p>
          <h1>
            Hi, I’m Alex Carter, a <span>{headlineRole}</span>.
          </h1>
          <p>
            This portfolio uses React state, props, reusable components, controlled forms,
            conditional rendering, conditional classes, and array-based add/remove behavior.
          </p>
          <div className="hero-actions">
            <Button onClick={() => setHeadlineRole('React UI Engineer')}>Update Role</Button>
            <Button variant="secondary" onClick={() => showAlert('Welcome to my React portfolio!')}>
              Show Alert
            </Button>
          </div>
        </div>

        <aside className="stats-card" aria-label="Portfolio statistics">
          <strong>{projects.length}</strong>
          <span>Projects</span>
          <strong>{totalTags}</strong>
          <span>Unique skills</span>
        </aside>
      </section>

      {alertMessage && (
        <p className="inline-alert" role="status">
          {alertMessage}
        </p>
      )}

      {visibleSections.about && (
        <section id="about" className="section split-section">
          <div>
            <p className="eyebrow">About</p>
            <h2>Clean React structure without direct DOM manipulation.</h2>
          </div>
          <p>
            Instead of manually selecting or changing DOM elements, this page updates text,
            theme styles, section visibility, alerts, projects, and forms through React state.
            Components receive data and callbacks through props, keeping each UI part reusable.
          </p>
        </section>
      )}

      {visibleSections.projects && (
        <section id="projects" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Projects</p>
              <h2>Reusable project cards powered by state arrays.</h2>
            </div>
            <Button variant="secondary" onClick={() => setProjects(initialProjects)}>
              Reset Projects
            </Button>
          </div>

          <ProjectForm onAddProject={addProject} />

          <div className="card-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onRemove={removeProject} />
            ))}
          </div>
        </section>
      )}

      {visibleSections.contact && (
        <section id="contact" className="section contact-section">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Controlled form with instant validation feedback.</h2>
            <p>
              Each field is connected to React state, validates as the user interacts,
              and only submits when the input passes basic checks.
            </p>
          </div>
          <ContactForm onSuccess={showAlert} />
        </section>
      )}
    </MainLayout>
  );
}
