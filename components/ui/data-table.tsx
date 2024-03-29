'use client';

import _ from 'lodash';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { Icons } from '@/components/icons';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  header?: string;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  onRowClick,
  header,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const maxVisibleButtons = 4;
  const activePage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const pagesRange = _.range(0, totalPages);
  const showNextAndPrevButtons = totalPages >= maxVisibleButtons;

  return (
    <div className="flex flex-col gap-3">
      {header && <h2 className="text-3xl font-medium">{header}</h2>}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick?.(row.original)}
                  className={`${onRowClick && 'cursor-pointer'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2">
        {showNextAndPrevButtons && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Icons.leftArrow className="size-4" />
          </Button>
        )}
        {maxVisibleButtons > totalPages
          ? pagesRange.map((pageIndex) => (
              <Button
                key={pageIndex}
                variant={pageIndex === activePage ? 'secondary' : 'outline'}
                size="icon"
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageIndex + 1}
              </Button>
            ))
          : pagesRange
              .slice(
                _.clamp(activePage, 0, totalPages - maxVisibleButtons),
                _.clamp(
                  activePage + maxVisibleButtons,
                  activePage + maxVisibleButtons,
                  totalPages,
                ),
              )
              .map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={pageIndex === activePage ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => table.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ))}
        {showNextAndPrevButtons && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={
              !table.getCanNextPage() ||
              activePage + maxVisibleButtons >= totalPages
            }
          >
            <Icons.rightArrow className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
