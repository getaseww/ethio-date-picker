import { ETHIOPIAN_MONTHS } from "./constants";
import { EthDateTime, limits } from "ethiopian-calendar-date-converter";

// Helper functions for Ethiopian calendar
export const getDaysInMonth = (month: number, year?: number) => {
  // 12 months with 30 days, 13th month (Pagume) with 5 or 6 days
  return month === 12 ? (isLeapYear(year) ? 6 : 5) : 30;
};

export const isLeapYear = (year?: number) => {
  // Ethiopian leap year calculation (every 4 years, with some exceptions)
  const y = year || new Date().getFullYear();
  return (y + 1) % 4 === 0;
};

export interface EthiopianDate {
  year: number;
  month: number; // 0-indexed (0 = መስከረም)
  day: number;
}

export const convertToGregorianDate = (ethiopianDate: EthiopianDate): Date => {
  const ethDateTime = new EthDateTime(
    ethiopianDate.year,
    ethiopianDate.month + 1,
    ethiopianDate.day,
    0,
    0,
    1
  );
  return ethDateTime.toEuropeanDate();
};

export const convertToEthiopianDate = (date: Date): EthiopianDate => {
  const et_date: any = EthDateTime.fromEuropeanDate(date);
  return { year: et_date.year, month: et_date.month - 1, day: et_date.date };
};


// Format Ethiopian date as a string
export const formatEthiopianDate = (date: Date | EthiopianDate): string => {
  if (date instanceof Date) {
    const ethiopianDate = convertToEthiopianDate(date)
    return `${ethiopianDate.day} ${ETHIOPIAN_MONTHS[ethiopianDate.month]} ${ethiopianDate.year}`
  } else {
    return `${date.day} ${ETHIOPIAN_MONTHS[date.month]} ${date.year}`
  }
}

// Format Ethiopian date range as a string
export const formatEthiopianDateRange = (startDate: Date, endDate: Date): string => {
  return `${formatEthiopianDate(startDate)} - ${formatEthiopianDate(endDate)}`
}