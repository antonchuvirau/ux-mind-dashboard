'use client';

import _ from 'lodash';
import { createColumnHelper } from '@tanstack/react-table';

import Table from '@/components/table';

import type { HubstaffActivity, HubstaffUser } from '@/hubstaff/validators';

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
    }),
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
    <section className="flex flex-col gap-2">
      <h2 className="text-3xl font-medium">Activities</h2>
      <Table data={data} columns={columns} />
    </section>
  );
};

export default ActivitiesList;
