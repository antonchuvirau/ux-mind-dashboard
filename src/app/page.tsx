import ProjectsList from './components/ProjectsList';
import MembersList from './components/MembersList';
// import ActivitiesList from './components/ActivitiesList';
import ActivitiesSum from './components/ActivitiesSum';
import HubstaffClient from './hubstaffClient';
import AddProjectForm from './components/addProjectForm';
import { revalidatePath } from 'next/cache';
import { prisma } from '../server/db';

export const revalidate = 3600;

const projects_test = [
  "Проект 1"
];

export default async function Home() {
  const client = new HubstaffClient();
  const projects = await client.getProjects(
    process.env.ORGANIZATION_ID ? Number(process.env.ORGANIZATION_ID) : 0
  );
  const members = await client.getOrganizationUsers();
  const activities = await client.getActivities(
    process.env.ORGANIZATION_ID ? Number(process.env.ORGANIZATION_ID) : 0,
    {
      startTime: new Date(2023, 1, 1),
      stopTime: new Date(2023, 1, 5),
    }
  );

  const addProject = async (form: FormData) => {
    'use server';
    const project = form.get("project-name")?.toString();
    if (!project) {
      return;
    }
    console.log(prisma.project);
    await prisma.project.create({
      data: {
        name: "name",
        upworkId: "1",
        hubstaffId: "1",
        asanaId: "1",
      },
    });
    projects_test.push(project);
    revalidatePath("/");
  }

  return (
    <>
      <main className="container mx-auto">
        {projects_test.map((project) => (
          <div key={project}>
            {project}
          </div>
        ))}
        <form action={addProject}>
          <input placeholder="Название проекта" name="project-name" />
          <button>Добавить</button>
        </form>
        <ActivitiesSum activities={activities} />
        <ProjectsList projects={projects} />
        <MembersList members={members} />
        {/*<ActivitiesList activities={activities} />*/}
      </main>
    </>
  );
}
