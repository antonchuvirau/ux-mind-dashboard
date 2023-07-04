import { type Activity } from '@app-masters/hubstaff-node-client/dist/types';

interface Props {
  activities: Activity[];
}

const ActivitiesList = ({ activities }: Props) => {
  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Activities
      </div>
      {activities?.map((activity) => {
        return (
          <div key={activity.id} className="mt-2">
            <div>{activity.id}</div>
            <div>{activity.created_at}</div>
            <div>{activity.updated_at}</div>
            <div>{activity.time_slot}</div>
            <div>{activity.starts_at}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivitiesList;
