import { type User as HubstaffUser } from '@app-masters/hubstaff-node-client/dist/types';

interface Props {
  members: HubstaffUser[];
}

const MembersList = ({ members }: Props) => {
  return (
    <div className="mt-5">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Members
      </div>
      {members?.map((member) => {
        return (
          <div key={member.id}>
            <div>{member.id}</div>
            <div>{member.name}</div>
            <div>{member.email}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersList;
