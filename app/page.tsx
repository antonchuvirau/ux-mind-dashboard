import ActivitiesList from '@/components/activities-list';
import MembersList from '@/components/members-list';
import ProjectsList from '@/components/projects-list';
import TrackedRange from '@/components/tracked-range';

import HubstaffClient from '@/hubstaff/client';

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const client = new HubstaffClient();

  const members = await client.getOrganizationMembers();
  const projects = await client.getProjects();

  /*const activities = await client.getActivities(
    new Date('2023-07-01'),
    new Date('2023-07-08')
  );*/

  const activities = await client.getActivities(
    searchParams.startDate
      ? new Date(String(searchParams.startDate))
      : new Date(),
    searchParams.endDate ? new Date(String(searchParams.endDate)) : new Date(),
  );

  return (
    <main className="container mx-auto py-10">
      <TrackedRange activities={activities} />
      <ActivitiesList activities={activities} members={members} />
      <MembersList members={members} />
      <ProjectsList projects={projects} />
    </main>
  );
}
