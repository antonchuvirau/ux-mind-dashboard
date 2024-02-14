import { cache } from 'react';
import Link from 'next/link';

import HubstaffClient from '@/hubstaff/client';

import { Button } from '@/components/ui/button';

import { Icons } from '@/components/icons';
import TrackedRange from '@/components/calendar/tracked-range';
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

  const activities =
    hubstaffProject &&
    (await hubstaffClient.getActivities(
      searchParams.startDate
        ? new Date(String(searchParams.startDate))
        : new Date(),
      searchParams.endDate
        ? new Date(String(searchParams.endDate))
        : new Date(),
      undefined,
      Number(project.hubstaffId),
    ));

  const members = activities && (await hubstaffClient.getOrganizationMembers());

  return (
    <main className="container flex flex-col gap-10 py-10">
      <div className="flex items-center gap-4 font-medium">
        <span className="text-3xl">{project.name}</span>
        <Button variant="outline" asChild>
          <Link href={`/projects/${project.id}/edit`}>Edit</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid gap-2">
          <h3 className="text-3xl font-medium">ID:</h3>
          <span className="text-xl">{project.id}</span>
        </div>
        <div className="grid gap-2">
          <h3 className="text-3xl font-medium">Upwork ID:</h3>
          <span className="text-xl">{project.upworkId || 'null'}</span>
        </div>
        <div className="grid gap-2">
          <h3 className="text-3xl font-medium">Hubstaff ID:</h3>
          <span className="text-xl">{project.hubstaffId || 'null'}</span>
        </div>
        <div className="grid gap-2">
          <h3 className="text-3xl font-medium">Asana ID:</h3>
          <span className="text-xl">{project.asanaId || 'null'}</span>
        </div>
      </div>
      {hubstaffProject ? (
        <>
          <section>
            <h3 className="text-3xl font-medium">Hubstaff data</h3>
            <p>Name: {hubstaffProject.project.name}</p>
            <Link
              target="_blank"
              href={`https://app.hubstaff.com/projects/${hubstaffProject.project.id}`}
              className="flex items-center gap-2"
            >
              <Icons.externalLink className="size-5" />
              <span className="underline">Open in Hubstaff</span>
            </Link>
          </section>
          {activities && (
            <>
              <section>
                <TrackedRange activities={activities} />
              </section>
              {members && activities.length > 0 && (
                <section>
                  <ActivitiesList activities={activities} members={members} />
                </section>
              )}
            </>
          )}
        </>
      ) : (
        <section>
          <span>
            Hubstaff project with <b>{`id=${project.hubstaffId || null}`}</b>{' '}
            doesn&apos;t exist
          </span>
        </section>
      )}
    </main>
  );
}
