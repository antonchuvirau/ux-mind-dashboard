'use client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from '@/components/tables/hubstaff-projects/columns';

import { type HubstaffProject } from '@/hubstaff/validators';

const HubstaffProjectsTable = ({
  projects,
}: {
  projects: HubstaffProject[];
}) => {
  return (
    <DataTable header="Hubstaff Projects" data={projects} columns={columns} />
  );
};

export { HubstaffProjectsTable };
