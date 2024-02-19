import { cache } from 'react';

import { db } from '@/lib/db';

import ProjectForm from '@/components/forms/project-form';

interface Props {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Edit project',
};

const getProject = cache((id: string) => {
  return db.project.findFirstOrThrow({
    where: { id },
  });
});

export default async function Edit({ params }: Props) {
  const project = await getProject(params.id);

  return (
    <main className="container flex flex-col gap-3 py-10">
      <h2 className="text-3xl font-medium">Edit project</h2>
      <ProjectForm defaultValues={project} />
    </main>
  );
}
