import { db } from '@/lib/db';

import InnerProjectsList from '@/components/inner-projects-list';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const projects = await db.project.findMany();

  return (
    <main className="container mx-auto py-10">
      <InnerProjectsList projects={projects} />
    </main>
  );
}
