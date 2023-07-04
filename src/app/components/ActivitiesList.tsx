const ActivitiesList = ( data: any ) => {
    return (
        <div>
            <div className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">Activities</div>
            {data.activities?.map((activity: any) => {
                return (
                    <div key={activity.id} className="mt-2">
                        <div>
                            {activity.id}
                        </div>
                        <div>
                            {activity.created_at}
                        </div>
                        <div>
                            {activity.updated_at}
                        </div>
                        <div>
                            {activity.time_slot}
                        </div>
                        <div>
                            {activity.starts_at}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivitiesList;