'use client';
import { createColumnHelper } from '@tanstack/react-table';
import Table from './ui/table';
import { type HubstaffActivity } from '../hubstaffValidators';
import _ from "lodash";

interface Props {
  activities: HubstaffActivity[];
}

const ActivitiesList = ({ activities }: Props) => {
  const columnHelper = createColumnHelper<HubstaffActivity>();

  const columns = [
    columnHelper.accessor('user_id', {
      header: 'User ID',
    }),
    columnHelper.accessor('tracked', {
      header: 'Tracked (sec)',
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