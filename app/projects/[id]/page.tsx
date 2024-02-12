import { cache } from 'react';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import HubstaffClient from '@/hubstaff/client';

import TrackedRange from '@/components/tracked-range';
import ActivitiesList from '@/components/activities-list';

import { db } from '@/lib/db';

interface Props {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getProject = cache((id: string) => {
  const project = db.project.findFirstOrThrow({
    where: { id },
  });

  return project;
});

export async function generateMetadata({ params }: Props) {
  const project = await getProject(params.id);

  return { title: project.name };
}

export default async function SingleProject({ params, searchParams }: Props) {
  const project = await getProject(params.id);

  const hubstaffClient = new HubstaffClient();

  const hubstaffProject = await hubstaffClient.getProject(
    Number(project.hubstaffId),
  );

  const activities = await hubstaffClient.getActivities(
    searchParams.startDate
      ? new Date(String(searchParams.startDate))
      : new Date(),
    searchParams.endDate ? new Date(String(searchParams.endDate)) : new Date(),
    undefined,
    Number(project.hubstaffId),
  );

  const members = await hubstaffClient.getOrganizationMembers();

  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-10 mt-0 text-5xl font-medium leading-tight">
        {project.name}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        ID:
      </div>
      <div className="text-primary mb-10 mt-0 text-2xl leading-tight">
        {project.id}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Upwork ID:
      </div>
      <div className="text-primary mb-10 text-2xl leading-tight">
        {project.upworkId || 'No'}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Hubstaff ID:
      </div>
      <div className="text-primary mb-10 mt-0 text-2xl leading-tight">
        {project.hubstaffId || 'No'}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Asana ID:
      </div>
      <div className="text-primary text-2xl leading-tight">
        {project.asanaId || 'No'}
      </div>
      {hubstaffProject && (
        <>
          <section className="my-10">
            <h1 className="text-xl font-bold">Hubstaff data</h1>
            <p>Name: {hubstaffProject.project.name}</p>
            <Link
              target="_blank"
              href={`https://app.hubstaff.com/projects/${hubstaffProject.project.id}`}
              className="mt-4 flex gap-2 underline"
            >
              <ArrowTopRightOnSquareIcon className="size-6" />
              Open in Hubstaff
            </Link>
          </section>
          {activities && (
            <>
              <section className="my-10">
                <TrackedRange activities={activities} />
              </section>
              <section className="my-10">
                <ActivitiesList activities={activities} members={members} />
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
