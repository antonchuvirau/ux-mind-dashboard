'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { type Project } from '@prisma/client';

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'Inner project ID',
  },
  {
    accessorKey: 'name',
    header: 'Inner project name',
  },
  {
    accessorKey: 'upworkId',
    header: 'Upwork ID',
  },
  {
    accessorKey: 'hubstaffId',
    header: 'Hubstaff ID',
  },
  {
    accessorKey: 'asanaId',
    header: 'Asana ID',
  },
];
