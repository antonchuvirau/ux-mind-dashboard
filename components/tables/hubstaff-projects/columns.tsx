'use client';

import { type ColumnDef } from '@tanstack/react-table';

export type Project = {
  id: number;
  name: string;
  status: string;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'Project ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];
