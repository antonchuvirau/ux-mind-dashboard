'use client';
import { createColumnHelper } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { type HubstaffActivity } from '../hubstaffValidators';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import addDays from 'date-fns/addDays';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import DateRangePicker from '../components/ui/date-range-picker';
import { useForm } from "react-hook-form"
import Table from './ui/table';
import { json } from 'stream/consumers';

interface Props {
  activities: HubstaffActivity[];
  date: Date;
}

const TrackedRange = ({ activities, date }: Props) => {
  const columnHelper = createColumnHelper<HubstaffActivity>();
  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  type FieldValues = {
    value: string
  }

  const { control } = useForm<FieldValues>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Activity ID',
    }),
    columnHelper.accessor('starts_at', {
      header: 'Starts At',
    }),
    columnHelper.accessor('tracked', {
      header: 'Tracked (sec)',
    }),
  ];

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
        minDate={date}
        maxDate={addDays(lastDayOfMonth(date),1)}
        control={control}
        required
      />
    </div>
  );
};

export default TrackedRange;
