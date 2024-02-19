'use client';

import { type ColumnDef } from '@tanstack/react-table';

export type Activity = {
  user_id: string;
  name: string | undefined;
  tracked: number;
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'user_id',
    header: 'Activity ID',
  },
  {
    accessorKey: 'name',
    header: 'Employee name',
  },
  {
    accessorKey: 'tracked',
    header: 'Tracked (h.)',
    cell: (info) => Math.trunc((info.getValue() as number) / 3600),
  },
];
