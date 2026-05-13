type ProjectCardProps = {
  image: string;
  role: string;
  title: string;
  body: string;
};

export function ProjectCard({ image, role, title, body }: ProjectCardProps) {
  return (
    <article className="project-card">
      <img src={image} alt={`${title} project photo`} />
      <div className="project-card-body">
        <p className="section-kicker">{role}</p>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}
