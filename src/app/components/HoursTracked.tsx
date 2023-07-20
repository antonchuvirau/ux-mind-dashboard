'use client';
import { useSearchParams } from 'next/navigation';
import { type HubstaffActivity } from '../hubstaffValidators';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  activities: HubstaffActivity[];
}

const HoursTracked = ({ activities }: Props) => {
  const params = useSearchParams();
  const [startDate, setStartDate] = useState(
    params.get("startDate")
    ? new Date(String(params.get("startDate")))
    : new Date()
  );
  const [endDate, setEndDate] = useState(
    params.get("endDate")
    ? new Date(String(params.get("endDate")))
    : new Date()
  );
  const router = useRouter();

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date);
    router.push("/?startDate=" + date.toISOString().slice(0,10) + "&endDate=" + endDate.toISOString().slice(0,10));
  }

  const handleChangEndDate = (date: Date) => {
    setEndDate(date);
    router.push("/?startDate=" + startDate.toISOString().slice(0,10) + "&endDate=" + date.toISOString().slice(0,10));
  }
  
  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Hours tracked
      </div>
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        Start date
      </div>
      <input
        className="mb-8 block h-16 w-80 rounded-xl border-2 border-solid border-black p-2"
        type="date"
        placeholder="Start date"
        onChange={(e) => handleChangeStartDate(new Date(e.target.value))}
        value={
          params.get("startDate")
          ? String(params.get("startDate"))
          : (new Date()).toISOString().slice(0,10)
        }
      />
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        End date
      </div>
      <input
        className="mb-8 block h-16 w-80 rounded-xl border-2 border-solid border-black p-2"
        type="date"
        placeholder="End date"
        onChange={(e) => handleChangEndDate(new Date(e.target.value))}
        value={
          params.get("endDate")
          ? String(params.get("endDate"))
          : (new Date()).toISOString().slice(0,10)
        }
      />
      <div className="text-primary mb-2 mt-0 text-2xl leading-tight">
        Hours: {Math.trunc(trackedTime / 3600)}
      </div>
    </div>
  );
};

export default HoursTracked;
