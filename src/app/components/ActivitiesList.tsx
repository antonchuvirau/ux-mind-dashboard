'use client';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';
import { type HubstaffActivity } from '../hubstaffValidators';
import { type HubstaffUser } from '../hubstaffValidators';
import _ from "lodash";

interface Props {
  activities: HubstaffActivity[];
  members: HubstaffUser[];
}

const ActivitiesList = ({ activities, members }: Props) => {
  const data = _.map(_.groupBy(activities, 'user_id'), (activities, user_id) => ({
    user_id,
    name: members.find((member) => member.id === Number(user_id))?.name,
    tracked: Math.trunc(_.sumBy(activities, 'tracked') / 3600),
  }));

  const columnHelper = createColumnHelper<typeof data[0]>();

  const columns = [
    columnHelper.accessor('user_id', {
      header: 'ID',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('tracked', {
      header: 'Tracked (hours)',
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
