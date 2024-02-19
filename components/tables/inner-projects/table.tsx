'use client';

import { useRouter } from 'next/navigation';

import { type Project } from '@prisma/client';

import { columns } from '@/components/tables/inner-projects/columns';

import { DataTable } from '@/components/ui/data-table';

const InnerProjectsTable = ({ projects }: { projects: Project[] }) => {
  const router = useRouter();

  // todo: prefetch like in previous table
  return (
    <DataTable
      header="Inner projects"
      data={projects}
      columns={columns}
      onRowClick={(project) => router.push(`/projects/${project.id}`)}
    />
  );
};

export { InnerProjectsTable };
