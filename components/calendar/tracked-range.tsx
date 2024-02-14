'use client';

// import { z } from 'zod';
import { addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { type HubstaffActivity } from '@/hubstaff/validators';

// import DateRangePicker from '@/components/calendar/date-range-picker';

// import { useZodForm } from '@/hooks/use-zod-form';

// import { Controller, useForm } from 'react-hook-form';

import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

interface Props {
  activities: HubstaffActivity[];
}

const TrackedRange = ({ activities }: Props) => {
  const router = useRouter();

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (range && range.to && range.from) {
      router.push(
        `?${new URLSearchParams({
          startDate: range.from.toISOString(),
          // Add an extra day because range should include the last day
          endDate: addDays(range.to, 1).toISOString(),
        }).toString()}`,
      );
    }
  }, [range, router]);

  // const { control, watch } = useZodForm({
  //   schema: z.object({
  //     start: z.date(),
  //     end: z.date(),
  //   }),
  //   mode: 'onChange',
  // });

  // const formState = watch();

  // useEffect(() => {
  //   if (formState.end) {
  //     router.push(
  //       '?' +
  //         new URLSearchParams({
  //           startDate: formState.start.toISOString(),
  //           // Add an extra day because range should include the last day
  //           endDate: addDays(formState.end, 1).toISOString(),
  //         }).toString(),
  //     );
  //   }
  // }, [formState, router]);

  const trackedHoursSum = Math.trunc(
    activities.reduce(
      (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
      0,
    ) / 3600,
  );

  const selectedPeriod = () => {
    if (range?.from) {
      return !range.to
        ? `${format(range.from, 'PP')} - ?`
        : `${format(range.from, 'PP')} - ${format(range.to, 'PP')}`;
    }
  };

  return (
    <section className="flex flex-col gap-3">
      {trackedHoursSum > 0 && (
        <div className="text-3xl font-medium">
          {`Employees tracked time sum = ${trackedHoursSum} h.`}
        </div>
      )}
      <Label>{`${selectedPeriod() ? `Selected period: ${selectedPeriod()}` : 'Select period*'}`}</Label>
      <Calendar
        className="max-w-max rounded-md border"
        mode="range"
        weekStartsOn={1}
        selected={range}
        onSelect={setRange}
      />
      {/* <DateRangePicker
        control={control}
        minDate={new Date('01-01-2023')}
        maxDate={new Date('31-12-2023')}
        label="Period"
        placeholderText="Select date range"
        startName="start"
        endName="end"
        required
      /> */}
    </section>
  );
};

export default TrackedRange;
