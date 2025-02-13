import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getTimeAgo(
  notificationDate: string,
  translation?: any
): string {
  const date = new Date(notificationDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: {
    unit: string;
    seconds: number;
    tOne?: string;
    tOther?: any;
  }[] = [
    {
      unit: "week",
      seconds: 604800,
      tOne: translation("weekAgo"),
      tOther: (value: string) =>
        translation("weekAgo_other", { amount: value }),
    },
    {
      unit: "day",
      seconds: 86400,
      tOne: translation("dayAgo"),
      tOther: (value: string) => translation("dayAgo_other", { amount: value }),
    },
    {
      unit: "hour",
      seconds: 3600,
      tOne: translation("hourAgo"),
      tOther: (value: string) =>
        translation("hourAgo_other", { amount: value }),
    },
    {
      unit: "minute",
      seconds: 60,
      tOne: translation("minuteAgo"),
      tOther: (value: string) =>
        translation("minuteAgo_other", { amount: value }),
    },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return count === 1 ? interval.tOne : interval.tOther(count);
    }
  }

  return translation("justNow");
}

export function getDate(dateStr?: string) {
  const strToDate = dateStr ? new Date(dateStr) : new Date();

  const date = strToDate.getDate().toString();
  const month = strToDate.getMonth().toString();
  const year = strToDate.getFullYear().toString();

  return { date, month, year };
}

export const formatDateTime = (date: string, locale?: string) => {
  return (
    new Date(date).toLocaleDateString(locale || "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }) +
    " - " +
    new Date(date).toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
