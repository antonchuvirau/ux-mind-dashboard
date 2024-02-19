'use client';

import _ from 'lodash';

import { columns } from '@/components/tables/activities/columns';

import { DataTable } from '@/components/ui/data-table';

import type { HubstaffActivity, HubstaffUser } from '@/hubstaff/validators';

const ActivitiesTable = ({
  activities,
  members,
}: {
  activities: HubstaffActivity[];
  members: HubstaffUser[];
}) => {
  const data = _.map(
    _.groupBy(activities, 'user_id'),
    (activities, user_id) => ({
      user_id,
      name: members.find((member) => member.id === Number(user_id))?.name,
      tracked: _.sumBy(activities, 'tracked'),
    }),
  );

  return <DataTable header="Activities" data={data} columns={columns} />;
};

export default ActivitiesTable;
