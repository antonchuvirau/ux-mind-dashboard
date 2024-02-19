'use client';

import { useRouter } from 'next/navigation';

import { type Project } from '@prisma/client';

import { columns } from '@/components/tables/inner-projects/columns';

import { DataTable } from '@/components/ui/data-table';

const InnerProjectsTable = ({ projects }: { projects: Project[] }) => {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Inner projects</h2>
      <DataTable
        // todo: prefetch like in previous table
        data={projects}
        columns={columns}
        onRowClick={(project) => router.push(`/projects/${project.id}`)}
      />
    </section>
  );
};

export { InnerProjectsTable };
