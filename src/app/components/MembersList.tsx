'use client';
import { type User as HubstaffUser } from '@app-masters/hubstaff-node-client/dist/types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';

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
    <div className="mt-5">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Members
      </div>
      <Table data={members} columns={columns} />
    </div>
  );
};

export default MembersList;
