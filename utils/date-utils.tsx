import { ETHIOPIAN_MONTHS } from "./constants"

// Helper functions for Ethiopian calendar
export const getDaysInMonth = (month: number, year?: number) => {
  // 12 months with 30 days, 13th month (Pagume) with 5 or 6 days
  return month === 12 ? (isLeapYear(year) ? 6 : 5) : 30
}

export const isLeapYear = (year?: number) => {
  // Ethiopian leap year calculation (every 4 years, with some exceptions)
  const y = year || new Date().getFullYear()
  return (y + 1) % 4 === 0
}

export interface EthiopianDate {
  year: number
  month: number // 0-indexed (0 = መስከረም)
  day: number
}

// This is a simplified conversion function - in a real implementation,
// you would need a more accurate algorithm
export const convertToEthiopianDate = (date: Date): EthiopianDate => {
  // This is a placeholder implementation
  // In a real implementation, you would convert from Gregorian to Ethiopian
  const ethiopianYear = date.getFullYear() - 8 // Approximate difference
  const ethiopianMonth = date.getMonth()
  const ethiopianDay = date.getDate()

  return {
    year: ethiopianYear,
    month: ethiopianMonth,
    day: ethiopianDay,
  }
}

// This is a simplified conversion function - in a real implementation,
// you would need a more accurate algorithm
export const convertToGregorianDate = (ethiopianDate: EthiopianDate): Date => {
  // This is a placeholder implementation
  // In a real implementation, you would convert from Ethiopian to Gregorian
  const gregorianYear = ethiopianDate.year + 8 // Approximate difference
  const gregorianMonth = ethiopianDate.month
  const gregorianDay = ethiopianDate.day

  return new Date(gregorianYear, gregorianMonth, gregorianDay)
}

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

