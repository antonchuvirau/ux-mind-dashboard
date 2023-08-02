import { prisma } from '../../../server/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import ProjectForm from '../../components/ui/projectForm/ProjectForm';

export const metadata = {
  title: 'Create project',
};

export default function Create() {
  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Add project
      </div>
      <ProjectForm />
    </main>
  );
}
