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
