import { type HubstaffActivity } from '../hubstaffValidators';

interface Props {
  activities: HubstaffActivity[];
}

const ActivitiesSum = ({ activities }: Props) => {
  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Hours tracked
      </div>
      {Math.trunc(trackedTime / 3600)}
    </div>
  );
};

export default ActivitiesSum;
