'use client';

import { addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { useState } from 'react';

import { type HubstaffActivity } from '@/hubstaff/validators';

import { Icons } from '@/components/icons';

import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';

interface Props {
  activities: HubstaffActivity[];
}

const TrackedRange = ({ activities }: Props) => {
  const router = useRouter();

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (range && range.to && range.from) {
      const from = range.from;
      const to = range.to;

      startTransition(() => {
        router.push(
          `?${new URLSearchParams({
            startDate: from.toISOString(),
            // Add an extra day because range should include the last day
            endDate: addDays(to, 1).toISOString(),
          }).toString()}`,
        );
      });
    }
  }, [range, router]);

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
          {isPending ? (
            <span className="flex items-center gap-2">
              <span>Getting activities</span>
              <Icons.spinner className="size-6 animate-spin" />
            </span>
          ) : (
            `Employees tracked time sum = ${trackedHoursSum} h.`
          )}
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
    </section>
  );
};

export default TrackedRange;
