import MembersList from './components/MembersList';
import ProjectsList from './components/ProjectsList';
import HubstaffClient from './hubstaffClient';

export default async function Home() {
  const client = new HubstaffClient();
  const members = await client.getOrganizationMembers();
  const projects = await client.getProjects();

  return (
    <main className="container mx-auto py-10">
      <MembersList members={members} />
      <ProjectsList projects={projects} />
    </main>
  );
}
