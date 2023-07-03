const ProjectsList = (data: any) => {
  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Projects
      </div>
      {data.projects?.map((project: any) => {
        return (
          <div key={project.id} className="mt-2">
            <div>{project.id}</div>
            <div>{project.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsList;
