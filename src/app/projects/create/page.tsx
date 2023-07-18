import { prisma } from '../../../server/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import ProjectForm from '../../components/ui/projectForm/ProjectForm';

export const metadata = {
  title: 'Create project',
};

export default function Create() {
  const addProject = async (form: FormData) => {
    'use server';
    const projectName = form.get('project-name')?.toString();
    const upworkID = form.get('upwork-id')?.toString();
    const hubstaffId = form.get('hubstaff-id')?.toString();
    const asanaID = form.get('asana-id')?.toString();
    if (!projectName) {
      return;
    }
    await prisma.project.create({
      data: {
        name: projectName,
        upworkId: upworkID,
        hubstaffId: hubstaffId,
        asanaId: asanaID,
      },
    });
    revalidatePath('/projects');
    redirect('/projects');
  };
  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Add project
      </div>
      <ProjectForm />
    </main>
  );
}
