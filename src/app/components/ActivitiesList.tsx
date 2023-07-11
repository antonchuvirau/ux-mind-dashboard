'use client';
import { type Activity } from '@app-masters/hubstaff-node-client/dist/types';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';

interface Props {
  activities: Activity[];
}

const ActivitiesList = ({ activities }: Props) => {
  const columnHelper = createColumnHelper<Activity>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Activity ID',
    }),
    columnHelper.accessor('starts_at', {
      header: 'Starts At',
    }),
    columnHelper.accessor('tracked', {
      header: 'Tracked (sec)',
    }),
  ];

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Activities
      </div>
      <Table data={activities} columns={columns} />
    </div>
  );
};

export default ActivitiesList;
