'use client';

import { createColumnHelper } from '@tanstack/react-table';

import Table from '@/components/table';

import { type HubstaffProject } from '@/hubstaff/validators';

interface Props {
  projects: HubstaffProject[];
}

const ProjectsList = ({ projects }: Props) => {
  const columnHelper = createColumnHelper<HubstaffProject>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Project ID',
    }),
    columnHelper.accessor('name', {
      header: 'Project name',
    }),
  ];

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Hubstaff Projects</h2>
      <Table data={projects} columns={columns} />
    </section>
  );
};

export default ProjectsList;
