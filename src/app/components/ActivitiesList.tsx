'use client';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';
import { type HubstaffActivity } from '../hubstaffValidators';

interface Props {
  activities: HubstaffActivity[];
}

const ActivitiesList = ({ activities }: Props) => {
  const columnHelper = createColumnHelper<HubstaffActivity>();

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
