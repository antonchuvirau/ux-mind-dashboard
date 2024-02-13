'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import _ from 'lodash';
import { useEffect } from 'react';

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[]; // eslint-disable-line
  onRowClick?: (row: T) => void;
  onPageChange?: (rows: T[]) => void;
  isLoading?: boolean;
  limit?: number;
  paginationRange?: number;
}

function Table<T>({
  data,
  isLoading,
  columns,
  onRowClick,
  onPageChange,
  limit = 10,
  paginationRange = 5, // How many page links to show in pagination, should be odd number
}: Props<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    defaultColumn: {
      // Fixed size will only be added to the column if present
      size: 0,
      maxSize: 0,
      minSize: 0,
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;

  useEffect(() => {
    onPageChange?.(table.getRowModel().rows.map((r) => r.original));
  }, [pageIndex, table, onPageChange]);

  useEffect(() => {
    table.setPageSize(limit);
  }, [table, limit]);

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full whitespace-nowrap text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="overflow-hidden text-ellipsis p-2"
                  {...{
                    style: {
                      maxWidth: header.column.columnDef.maxSize || undefined,
                      minWidth: header.column.columnDef.minSize || undefined,
                      width: header.column.columnDef.size || undefined,
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {!isLoading &&
            table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={`cursor-pointer hover:bg-zinc-200/50 ${
                  rowIndex % 2 ? 'bg-zinc-200/20' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    {...{
                      style: {
                        maxWidth: cell.column.columnDef.maxSize || undefined,
                        minWidth: cell.column.columnDef.minSize || undefined,
                        width: cell.column.columnDef.size || undefined,
                      },
                    }}
                    className="overflow-hidden text-ellipsis whitespace-nowrap py-3 pl-2 pr-6"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-2 flex w-full justify-center">
        <button
          className="cursor-pointer px-2 disabled:cursor-not-allowed disabled:text-zinc-300"
          disabled={!table.getCanPreviousPage()}
          onClick={table.previousPage}
        >
          &lt;
        </button>
        {_.range(0, table.getPageCount())
          .slice(
            _.clamp(
              table.getState().pagination.pageIndex -
                Math.floor(paginationRange / 2),
              0,
              table.getPageCount(),
            ),
            _.clamp(
              table.getState().pagination.pageIndex -
                Math.floor(paginationRange / 2),
              0,
              table.getPageCount(),
            ) + paginationRange,
          )
          .map((pageIndex) => (
            <div
              key={pageIndex}
              className={`cursor-pointer px-3`}
              onClick={() => table.setPageIndex(pageIndex)}
            >
              {pageIndex + 1}
            </div>
          ))}
        <button
          className="cursor-pointer px-2 disabled:cursor-not-allowed disabled:text-zinc-300"
          disabled={!table.getCanNextPage()}
          onClick={table.nextPage}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Table;
