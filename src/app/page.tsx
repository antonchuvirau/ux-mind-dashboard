import ActivitiesList from './components/ActivitiesList';
import HoursTracked from './components/HoursTracked';
import MembersList from './components/MembersList';
import ProjectsList from './components/ProjectsList';
import HubstaffClient from './hubstaffClient';

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const client = new HubstaffClient();
  const members = await client.getOrganizationMembers();
  const projects = await client.getProjects();
  /*const activities = await client.getActivities(
    new Date('2023-07-01'),
    new Date('2023-07-08')
  );*/
  const activities = await client.getActivities(
    new Date(searchParams.startDate ? String(searchParams.startDate) : '2023-07-01'),
    new Date(searchParams.startDate ? String(searchParams.endDate) : '2023-07-08')
  );

  return (
    <main className="container mx-auto py-10">
      <HoursTracked activities={activities} />
      <MembersList members={members} />
      <ProjectsList projects={projects} />
      <ActivitiesList activities={activities} />
    </main>
  );
}
