import ProjectsList from './components/ProjectsList';
import MembersList from './components/MembersList';
import { MyHubstaffClient } from './api';

export default async function Home() {
  const client = new MyHubstaffClient(
    process.env.ACCESS_TOKEN,
    process.env.REFRESH_TOKEN
  );
  const projects = await client.getProjects(
    process.env.ORGANIZATION_ID ? Number(process.env.ORGANIZATION_ID) : 0
  );
  const members = await client.getOrganizationUsers();

  return (
    <>
      <main className="container mx-auto">
        <ProjectsList projects={projects} />
        <MembersList members={members} />
      </main>
    </>
  );
}
