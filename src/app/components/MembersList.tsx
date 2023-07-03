const MembersList = async ( data: any ) => {
    //console.log(data);
    return (
        <div className="mt-5">
            <div className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">Members</div>
            {data.members?.map((member: any) => {
                return (
                    <div key={member.id}>
                        <div>
                            {member.id}
                        </div>
                        <div>
                            {member.name}
                        </div>
                        <div>
                            {member.email}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MembersList;