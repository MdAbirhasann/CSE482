import Button from './Button.jsx';

export default function ProjectCard({ project, onRemove }) {
  return (
    <article className="card">
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>

      <ul className="tag-list" aria-label={`${project.title} technologies`}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <div className="card-actions">
        <a className="text-link" href={project.link} target="_blank" rel="noreferrer">
          View project
        </a>
        <Button variant="danger" onClick={() => onRemove(project.id)}>
          Remove
        </Button>
      </div>
    </article>
  );
}
