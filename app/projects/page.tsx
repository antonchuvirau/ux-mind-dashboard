import { db } from '@/lib/db';

import { InnerProjectsTable } from '@/components/tables/inner-projects/table';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const projects = await db.project.findMany();

  return (
    <main className="container py-10">
      <InnerProjectsTable projects={projects} />
    </main>
  );
}
