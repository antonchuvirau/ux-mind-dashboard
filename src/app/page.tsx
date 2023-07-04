import ProjectsList from './components/ProjectsList';
import MembersList from './components/MembersList';
import ActivitiesList from './components/ActivitiesList';
import HubstaffClient from './hubstaffClient';

export const revalidate = 3600;

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

  return (
    <>
      <main className="container mx-auto">
        <ProjectsList projects={projects} />
        <MembersList members={members} />
        <ActivitiesList activities={activities} />
      </main>
    </>
  );
}
