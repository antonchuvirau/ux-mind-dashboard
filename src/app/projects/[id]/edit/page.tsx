import { prisma } from '../../../../server/db';
import { cache } from 'react';
import ProjectForm from '../../../components/ui/projectForm/ProjectForm';

interface Props {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Edit project',
};

const getProject = cache((id: string) => {
  return prisma.project.findFirstOrThrow({
    where: { id },
  });
});

export default async function Edit({ params }: Props) {
  const project = await getProject(params.id);
  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Edit project
      </div>
      <ProjectForm defaultValues={project} />
    </main>
  );
}