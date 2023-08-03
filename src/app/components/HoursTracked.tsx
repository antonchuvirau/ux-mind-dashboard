'use client';
import { useSearchParams } from 'next/navigation';
import { type HubstaffActivity } from '../hubstaffValidators';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  activities: HubstaffActivity[];
}

const months = [
  {
    id: 1,
    name: "january",
  },
  {
    id: 2,
    name: "february",
  },
  {
    id: 3,
    name: "march",
  },
  {
    id: 4,
    name: "april",
  },
  {
    id: 5,
    name: "may",
  },
  {
    id: 6,
    name: "june",
  },
  {
    id: 7,
    name: "july",
  },
  {
    id: 8,
    name: "august",
  },
  {
    id: 9,
    name: "september",
  },
  {
    id: 10,
    name: "october",
  },
  {
    id: 11,
    name: "november",
  },
  {
    id: 12,
    name: "december",
  },
];

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

  //console.log("activities");
  //console.log(activities.length);
  
  const trackedTime = activities.reduce(
    (sum, activity) => (activity.tracked ? sum + activity.tracked : sum),
    0
  );

  return (
    <div>
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        Tracked time
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-md">
        {months.map((month) => {
          return (
            <Link key={month.name} href={`/tracked/${month.id}`}>
              <div className="p-2 border-solid border-2 hover:bg-gray-200/50">
                {month.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HoursTracked;
