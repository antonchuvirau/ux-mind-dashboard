'use client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from '@/components/tables/members/columns';

import { type HubstaffUser } from '@/hubstaff/validators';

const MembersTable = ({ members }: { members: HubstaffUser[] }) => {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Hubstaff Members</h2>
      <DataTable data={members} columns={columns} />
    </section>
  );
};

export { MembersTable };
