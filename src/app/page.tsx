import ActivitiesList from './components/ActivitiesList';
import MembersList from './components/MembersList';
import ProjectsList from './components/ProjectsList';
import HubstaffClient from './hubstaffClient';

export default async function Home() {
  const client = new HubstaffClient();
  const members = await client.getOrganizationMembers();
  const projects = await client.getProjects();
  const activities = await client.getActivities(
    new Date('2023-07-01'),
    new Date('2023-07-08')
  );

  return (
    <main className="container mx-auto py-10">
      <MembersList members={members} />
      <ProjectsList projects={projects} />
      <ActivitiesList activities={activities} />
    </main>
  );
}
