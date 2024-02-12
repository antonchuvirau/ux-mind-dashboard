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
    <div className="mt-8">
      <div className="mb-2 mt-0 text-5xl font-medium leading-tight">
        Hubstaff Projects
      </div>
      <Table data={projects} columns={columns} />
    </div>
  );
};

export default ProjectsList;
