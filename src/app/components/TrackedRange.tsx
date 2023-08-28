'use client';
import { type HubstaffActivity } from '../hubstaffValidators';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import addDays from 'date-fns/addDays';
import DateRangePicker from '../components/ui/date-range-picker';
import useZodForm from '@/utils/useZodForm';
import { z } from 'zod';

interface Props {
  activities: HubstaffActivity[];
  date: Date;
}

const TrackedRange = ({ activities, date }: Props) => {
  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  const { control } = useZodForm({
    schema: z.any(), // TODO: use proper type here
  });

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        Hours: {Math.trunc(trackedTime / 3600)}
      </div>
      <DateRangePicker
        label={`Period`}
        placeholderText={`Select date range`}
        startName="period.start"
        endName="period.end"
        minDate={new Date('01-01-2023')}
        maxDate={new Date('31-12-2023')}
        control={control}
        required
      />
    </div>
  );
};

export default TrackedRange;
