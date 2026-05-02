import { useState } from 'react';
import Button from './Button.jsx';

const emptyProject = {
  title: '',
  description: '',
  tags: '',
  link: ''
};

export default function ProjectForm({ onAddProject }) {
  const [project, setProject] = useState(emptyProject);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setProject((currentProject) => ({ ...currentProject, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!project.title.trim() || !project.description.trim()) {
      setError('Project title and description are required.');
      return;
    }

    if (project.link && !project.link.startsWith('http')) {
      setError('Project link must start with http or https.');
      return;
    }

    onAddProject({
      title: project.title.trim(),
      description: project.description.trim(),
      tags: project.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      link: project.link.trim() || '#'
    });

    setProject(emptyProject);
    setError('');
  }

  return (
    <form className="mini-form" onSubmit={handleSubmit} noValidate>
      <h3>Add a Project</h3>

      <div className="form-grid compact">
        <label>
          Project title
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="Weather App"
            required
          />
        </label>

        <label>
          Project link
          <input
            type="url"
            name="link"
            value={project.link}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </label>
      </div>

      <label>
        Description
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          placeholder="Briefly describe the project"
          required
          rows="3"
        />
      </label>

      <label>
        Tags, separated by commas
        <input
          type="text"
          name="tags"
          value={project.tags}
          onChange={handleChange}
          placeholder="React, API, CSS"
        />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <Button type="submit">Add Project</Button>
    </form>
  );
}
