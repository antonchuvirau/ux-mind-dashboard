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

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-3xl font-medium">Activities</h2>
      <DataTable data={data} columns={columns} />
    </section>
  );
};

export default ActivitiesTable;
