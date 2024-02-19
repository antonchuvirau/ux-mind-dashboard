'use client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from '@/components/tables/members/columns';

import { type HubstaffUser } from '@/hubstaff/validators';

const MembersTable = ({ members }: { members: HubstaffUser[] }) => {
  return (
    <DataTable header="Hubstaff Members" data={members} columns={columns} />
  );
};

export { MembersTable };
