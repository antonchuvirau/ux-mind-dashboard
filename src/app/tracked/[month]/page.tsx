import HubstaffClient from '@/app/hubstaffClient';
import TrackedRange from '../../components/TrackedRange';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import addDays from 'date-fns/addDays';

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function TrackedTime({
  params,
  searchParams,
}: {
  params: { month: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const client = new HubstaffClient();

  const date = new Date(`2023-${Number(params.month) < 10 ? "0" + params.month : params.month}-01`);

  const activities = await client.getActivities(
    searchParams.startDate
    ? new Date(String(searchParams.startDate))
    : date,
    searchParams.endDate
    ? new Date(String(searchParams.endDate))
    : addDays(lastDayOfMonth(date),1),
  );
  console.log(activities);

  return (
    <main className="container mx-auto py-10">
      <div className="text-primary mb-2 mt-0 text-5xl font-medium leading-tight">
        {monthNames[Number(params.month) - 1]}
      </div>
      <TrackedRange activities={activities} date={date} monthId={Number(params.month)} />
    </main>
  );
}
