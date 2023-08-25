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
  const columnHelper = createColumnHelper<HubstaffActivity>();

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

  const getTimeForUsers = (data: HubstaffActivity[]) => {
    const timeData: {id: number, tracked: number}[] = [];
    data.forEach(element => {
      timeData.push({
        id: 1,
        tracked: 1,
      });
    });
  }
  const data = _.map(_.groupBy(activities, 'user_id'), (user, id) => ({
    user_id: id,
    name: members.find((member) => member.id === Number(id))?.name,
    tracked: Math.trunc(_.sumBy(user, 'tracked') / 3600),
  }));

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Activities
      </div>
      <Table data={data} columns={columns} />
    </div>
  );
};

export default ActivitiesList;