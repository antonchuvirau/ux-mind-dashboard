'use client';

import { createColumnHelper } from '@tanstack/react-table';

import Table from '@/components/table';

import { type HubstaffUser } from '@/hubstaff/validators';

interface Props {
  members: HubstaffUser[];
}

const MembersList = ({ members }: Props) => {
  const columnHelper = createColumnHelper<HubstaffUser>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Member ID',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
  ];

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Hubstaff Members</h2>
      <Table data={members} columns={columns} />
    </section>
  );
};

export default MembersList;
