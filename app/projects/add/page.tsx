import ProjectForm from '@/components/forms/project-form';

export const metadata = {
  title: 'Create project',
};

export default function Create() {
  return (
    <main className="container flex flex-col gap-3 py-10">
      <h2 className="text-3xl font-medium">Add project</h2>
      <ProjectForm />
    </main>
  );
}
