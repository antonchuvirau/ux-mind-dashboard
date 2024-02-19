'use client';

import { type ColumnDef } from '@tanstack/react-table';

export type Member = {
  id: number;
  name: string;
  email: string;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'id',
    header: 'Member ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
