import ActivitiesTable from '@/components/tables/activities/table';
import { MembersTable } from '@/components/tables/members/table';
import { HubstaffProjectsTable } from '@/components/tables/hubstaff-projects/table';
import TrackedRange from '@/components/tracked-range';

import HubstaffClient from '@/hubstaff/client';

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const hubstaffClient = new HubstaffClient();

  const members = await hubstaffClient.getOrganizationMembers();
  const projects = await hubstaffClient.getProjects();

  // const activities = await hubstaffClient.getActivities(
  //   new Date('2023-07-01'),
  //   new Date('2023-07-08')
  // );

  const activities = await hubstaffClient.getActivities(
    searchParams.startDate
      ? new Date(String(searchParams.startDate))
      : new Date(),
    searchParams.endDate ? new Date(String(searchParams.endDate)) : new Date(),
  );

  return (
    <main className="container flex flex-col gap-8 py-10">
      <TrackedRange activities={activities} />
      {activities.length > 0 && (
        <ActivitiesTable activities={activities} members={members} />
      )}
      <MembersTable members={members} />
      <HubstaffProjectsTable projects={projects} />
    </main>
  );
}
