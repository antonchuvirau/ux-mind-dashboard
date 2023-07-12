import { prisma } from '../../server/db';
import InnerProjectsList from '../components/InnerProjectsList';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const projects = await prisma.project.findMany();
  console.log(projects);
  return (
    <main className="container mx-auto py-10">
      <InnerProjectsList projects={projects} />
    </main>
  );
}
