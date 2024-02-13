'use client';

import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';

import { type Project } from '@prisma/client';

import Table from '@/components/table';

interface Props {
  projects: Project[];
}

const InnerProjectsList = ({ projects }: Props) => {
  const router = useRouter();

  const columnHelper = createColumnHelper<Project>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Project ID',
    }),
    columnHelper.accessor('name', {
      header: 'Project name',
    }),
    columnHelper.accessor('upworkId', {
      header: 'Upwork id',
    }),
    columnHelper.accessor('hubstaffId', {
      header: 'Hubstaff id',
    }),
    columnHelper.accessor('asanaId', {
      header: 'Asana id',
    }),
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Projects</h2>
      <Table
        data={projects}
        columns={columns}
        onRowClick={(project) => router.push(`/projects/${project.id}`)}
        onPageChange={(projects) =>
          // TODO: maybe we don't want to prefetch whole page, but rows on hover instead?
          // Could waste a lot of prefetch requests if page size is big
          projects.forEach((row) => {
            router.prefetch(`/projects/${row.id}`);
          })
        }
      />
    </div>
  );
};

export default InnerProjectsList;
