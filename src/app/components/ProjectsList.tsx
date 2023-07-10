'use client'
import { type Project as HubstaffProject } from '@app-masters/hubstaff-node-client/dist/types';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';

interface Props {
  projects: HubstaffProject[];
}

const ProjectsList = ({ projects }: Props) => {
  const columnHelper = createColumnHelper<HubstaffProject>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Project ID',
    }),
    columnHelper.accessor('name', {
      header: 'Project name',
    }),
  ];

  const table = useReactTable({
    columns,
    data: projects,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    defaultColumn: {
      // Fixed size will only be added to the column if present
      size: 0,
      maxSize: 0,
      minSize: 0,
    },
  });

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Projects
      </div>
      {projects?.map((project) => {
        return (
          <div key={project.id} className="mt-2">
            <div>{project.id}</div>
            <div>{project.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsList;
