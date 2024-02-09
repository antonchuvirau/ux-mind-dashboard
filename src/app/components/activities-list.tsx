'use client';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';
import { type HubstaffActivity } from '../hubstaff-validators';
import { type HubstaffUser } from '../hubstaff-validators';
import _ from 'lodash';

interface Props {
  activities: HubstaffActivity[];
  members: HubstaffUser[];
}

const ActivitiesList = ({ activities, members }: Props) => {
  const data = _.map(
    _.groupBy(activities, 'user_id'),
    (activities, user_id) => ({
      user_id,
      name: members.find((member) => member.id === Number(user_id))?.name,
      tracked: _.sumBy(activities, 'tracked'),
    })
  );

  const columnHelper = createColumnHelper<(typeof data)[0]>();

  const columns = [
    columnHelper.accessor('user_id', {
      header: 'ID',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('tracked', {
      header: 'Tracked (hours)',
      cell: (info) => Math.trunc(info.getValue() / 3600),
    }),
  ];

  return (
    <section>
      <h2 className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Activities
      </h2>
      <Table data={data} columns={columns} />
    </section>
  );
};

export default ActivitiesList;
