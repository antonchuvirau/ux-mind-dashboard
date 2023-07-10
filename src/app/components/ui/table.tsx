import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import _ from 'lodash';
import { useEffect, useState } from 'react';

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  onRowClick?: (row: T) => void;
  title: string;
  isLoading?: boolean;
  primaryField: string;
  limit?: number;
  paginationRange?: number;
}

function Table<T>({
  data,
  isLoading,
  columns,
  title,
  onRowClick,
  primaryField,
  limit = 20,
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

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    table.setPageSize(limit);
  }, [table, limit]);

  return (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full whitespace-nowrap text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-2 px-2 overflow-hidden text-ellipsis text-secondary"
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
                        header.getContext()
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
                className={`hover:bg-gray-200/50 cursor-pointer ${
                  rowIndex % 2 ? 'bg-gray-200/20' : ''
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
                    className="py-3 pl-2 pr-6 whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="w-full flex justify-center mt-2 text-secondary">
        <button
          className="disabled:text-gray-300 disabled:cursor-not-allowed px-2 cursor-pointer"
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
              table.getPageCount()
            ),
            _.clamp(
              table.getState().pagination.pageIndex -
                Math.floor(paginationRange / 2),
              0,
              table.getPageCount()
            ) + paginationRange
          )
          .map((pageIndex) => (
            <div
              key={pageIndex}
              className={`px-3 cursor-pointer ${
                table.getState().pagination.pageIndex === pageIndex &&
                'text-primary'
              }`}
              onClick={() => table.setPageIndex(pageIndex)}
            >
              {pageIndex + 1}
            </div>
          ))}
        <button
          className="disabled:text-gray-300 disabled:cursor-not-allowed px-2 cursor-pointer"
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
