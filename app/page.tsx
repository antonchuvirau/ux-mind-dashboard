import ActivitiesList from '@/components/activities-list';
import MembersList from '@/components/members-list';
import ProjectsList from '@/components/projects-list';
import TrackedRange from '@/components/calendar/tracked-range';

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
        <ActivitiesList activities={activities} members={members} />
      )}
      <MembersList members={members} />
      <ProjectsList projects={projects} />
    </main>
  );
}
