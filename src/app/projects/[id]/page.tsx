import HubstaffClient from '@/app/hubstaffClient';
import ActivitiesList from '../../components/ActivitiesList';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { type Metadata } from 'next';
import TrackedRange from '../../components/TrackedRange';
import Link from 'next/link';
import { cache } from 'react';
import { prisma } from '../../../server/db';

const getProject = cache((id: string) => {
  return prisma.project.findFirstOrThrow({
    where: { id },
  });
});

interface Props {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.id);
  return { title: project.name };
}

export default async function SingleProject({
    params,
    searchParams,
  }: Props
) {
  const project = await getProject(params.id);
  const client = new HubstaffClient();
  const hubstaffProject = await client.getProject(Number(project.hubstaffId)).catch((e) => {
    console.log(e);
    return null;
  });

  console.log({ project, hubstaffProject });

  const activities = await client.getActivities(
    searchParams.startDate
    ? new Date(String(searchParams.startDate))
    : new Date(),
    searchParams.endDate
    ? new Date(String(searchParams.endDate))
    : new Date(),
    undefined,
    Number(project.hubstaffId),
  );

  const members = await client.getOrganizationMembers();

  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-10 mt-0 text-5xl font-medium leading-tight">
        {project?.name}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        ID:
      </div>
      <div className="text-primary mb-10 mt-0 text-2xl leading-tight">
        {project?.id}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Upwork ID:
      </div>
      <div className="text-primary mb-10 text-2xl leading-tight">
        {project?.upworkId || 'No'}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Hubstaff ID:
      </div>
      <div className="text-primary mb-10 mt-0 text-2xl leading-tight">
        {project?.hubstaffId || 'No'}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Asana ID:
      </div>
      <div className="text-primary text-2xl leading-tight">
        {project?.asanaId || 'No'}
      </div>

      {hubstaffProject && (
        <>
          <section className="my-10">
            <h1 className="text-xl font-bold">Hubstaff data</h1>
            <p>Name: {hubstaffProject.name}</p>
            <Link
              href={`https://app.hubstaff.com/projects/${
                hubstaffProject.id || ''
              }`}
              className="mt-4 flex gap-2 underline"
              target="_blank"
            >
              <ArrowTopRightOnSquareIcon className="h-6 w-6" />
              Open in Hubstaff
            </Link>
          </section>
          <section className="my-10">
            {activities &&
              <TrackedRange
                activities={activities}
              />}
          </section>
          <section className="my-10">
            {activities &&
              <ActivitiesList
                activities={activities}
                members={members}
              />}
          </section>
        </>
      )}
    </main>
  );
}
