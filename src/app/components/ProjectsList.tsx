'use client'
import { type Project as HubstaffProject } from '@app-masters/hubstaff-node-client/dist/types';
import {
  createColumnHelper,
} from '@tanstack/react-table';
import Table from './ui/table';

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

  return (
    <div className="mt-8">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Projects
      </div>
      <Table
        title="project"
        primaryField="project.name"
        data={projects}
        columns={columns}
      />
    </div>
  );
};

export default ProjectsList;
