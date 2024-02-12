import ProjectForm from '@/components/ui/project-form';

export const metadata = {
  title: 'Create project',
};

export default function Create() {
  return (
    <main className="container mx-auto py-10">
      <div className="mb-2 mt-0 text-5xl font-medium leading-tight">
        Add project
      </div>
      <ProjectForm />
    </main>
  );
}
