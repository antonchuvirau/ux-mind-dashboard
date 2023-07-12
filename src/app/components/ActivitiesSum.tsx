/* eslint-disable */
interface Props {
  activities: any[];
}

const ActivitiesSum = ({ activities }: Props) => {
  const trackedTime = activities.reduce(
    (sum: number, activity: any) =>
      activity.tracked ? sum + activity.tracked : sum,
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
