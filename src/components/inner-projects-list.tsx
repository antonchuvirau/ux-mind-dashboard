'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';
import { type Project } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface Props {
  projects: Project[];
}

const InnerProjectsList = ({ projects }: Props) => {
  const columnHelper = createColumnHelper<Project>();
  const router = useRouter();

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
    <div className="mt-8">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Projects
      </div>
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
