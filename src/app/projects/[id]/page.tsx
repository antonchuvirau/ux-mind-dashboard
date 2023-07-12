import { prisma } from '../../../server/db';
import { revalidatePath } from 'next/cache';
interface Props {
  params: {
    id: string
  }
}

export default async function SingleProject({ params } : Props) {
  const project = await prisma.project.findFirst({
    where: { id: params.id },
  });
  console.log(project);
  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-10 mt-0 text-5xl font-medium leading-tight">
        {project?.name}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        ID:
      </div>
      <div className="text-primary mb-10 mt-0 text-2xl leading-tight">
        {project?.id}:
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Upwork ID:
      </div>
      <div className="text-primary mb-10 text-2xl leading-tight">
        {project?.upworkId || "No"}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Hubstaff ID:
      </div>
      <div className="text-primary mb-10 mt-0 text-2xl leading-tight">
        {project?.hubstaffId || "No"}
      </div>
      <div className="text-primary mb-2 text-2xl font-medium leading-tight">
        Asana ID:
      </div>
      <div className="text-primary text-2xl leading-tight">
        {project?.asanaId || "No"}
      </div>
    </main>
  );
}
