export function getTimeAgo(notificationDate: string): string {
  const date = new Date(notificationDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { unit: string; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return count === 1
        ? `1 ${interval.unit} ago`
        : `${count} ${interval.unit}s ago`;
    }
  }

  return "Just now";
}

export function getDate(dateStr?: string) {
  const strToDate = dateStr ? new Date(dateStr) : new Date();

  const date = strToDate.getDate().toString();
  const month = strToDate.getMonth().toString();
  const year = strToDate.getFullYear().toString();

  return { date, month, year };
}
