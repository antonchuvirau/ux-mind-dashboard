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
    <section className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Hubstaff Projects</h2>
      <DataTable data={projects} columns={columns} />
    </section>
  );
};

export { HubstaffProjectsTable };
