'use client';
import { type HubstaffActivity } from '../hubstaffValidators';
import DateRangePicker from '../components/ui/date-range-picker';
import useZodForm from '@/utils/useZodForm';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  activities: HubstaffActivity[];
}

const TrackedRange = ({ activities }: Props) => {
  const router = useRouter();

  const { control, watch } = useZodForm({
    schema: z.object({
      start: z.date(),
      end: z.date(),
    }),
    mode: 'onChange',
  });

  const formState = watch();
  useEffect(() => {
    if (formState.end) {
      router.push(
        '/?startDate=' +
          formState.start.toISOString().slice(0, 10) +
          '&endDate=' +
          formState.end.toISOString().slice(0, 10)
      );
    }
  }, [formState, router])

  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        Hours: {Math.trunc(trackedTime / 3600)}
      </div>
      <DateRangePicker
        label={`Period`}
        placeholderText={`Select date range`}
        startName="start"
        endName="end"
        minDate={new Date('01-01-2023')}
        maxDate={new Date('31-12-2023')}
        control={control}
        required
      />
    </div>
  );
};

export default TrackedRange;
