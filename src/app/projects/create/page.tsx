import { prisma } from '../../../server/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
      <form action={addProject} className="mt- w-80">
        <input
          className="mb-8 block h-16 w-full rounded-xl border-2 border-solid border-black p-2"
          placeholder="Название проекта"
          name="project-name"
        />
        <input
          className="mb-8 block h-16 w-full rounded-xl border-2 border-solid border-black p-2"
          placeholder="Upwork ID"
          name="upwork-id"
        />
        <input
          className="mb-8 block h-16 w-full rounded-xl border-2 border-solid border-black p-2"
          placeholder="Hubstaff ID"
          name="hubstaff-id"
        />
        <input
          className="mb-8 block h-16 w-full rounded-xl border-2 border-solid border-black p-2"
          placeholder="Asana ID"
          name="asana-id"
        />
        <button className="mb-8 block h-16 w-full rounded-xl border-2 border-solid border-black bg-black p-2 text-white">
          Добавить
        </button>
      </form>
    </main>
  );
}
