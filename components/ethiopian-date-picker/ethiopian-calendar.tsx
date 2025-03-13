import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { cn } from "@lib/utils";

// Ethiopian calendar constants
export const ETHIOPIAN_MONTHS = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜ",
];

export const ETHIOPIAN_WEEKDAYS = [
  "ሰኞ",
  "ማክሰኞ",
  "ረቡዕ",
  "ሐሙስ",
  "አርብ",
  "ቅዳሜ",
  "እሁድ",
];

// Helper functions for Ethiopian calendar
const getDaysInMonth = (month: number) => {
  // 12 months with 30 days, 13th month (Pagume) with 5 or 6 days
  return month === 12 ? (isLeapYear() ? 6 : 5) : 30;
};

const isLeapYear = (year?: number) => {
  // Ethiopian leap year calculation (every 4 years, with some exceptions)
  const y = year || new Date().getFullYear();
  return (y + 1) % 4 === 0;
};

interface EthiopianCalendarProps {
  value?: Date | Date[];
  onChange?: (date: Date | Date[]) => void;
  mode?: "single" | "range" | "week" | "month" | "year";
  className?: string;
}

export function EthiopianCalendar({
  value,
  onChange,
  mode = "single",
  className,
}: EthiopianCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(0); // 0-indexed (0 = መስከረም)
  const [currentYear, setCurrentYear] = useState(2016); // Current Ethiopian year
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Generate years for the dropdown (range of 20 years)
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const handleDateClick = (day: number) => {
    // Create a JavaScript Date object (this is simplified - would need proper conversion)
    const newDate = new Date(2023, currentMonth, day); // This would need actual Ethiopian to Gregorian conversion

    if (mode === "single") {
      setSelectedDates([newDate]);
      onChange?.(newDate);
    } else if (mode === "range") {
      if (selectedDates.length === 0 || selectedDates.length === 2) {
        setSelectedDates([newDate]);
      } else {
        const rangeStart = selectedDates[0];
        const rangeEnd = newDate > rangeStart ? newDate : rangeStart;
        const updatedRange = [
          rangeStart < newDate ? rangeStart : newDate,
          rangeEnd,
        ];
        setSelectedDates(updatedRange);
        onChange?.(updatedRange);
      }
    } else if (mode === "week") {
      // Calculate the week based on the selected day
      const weekStart = new Date(newDate);
      const dayOfWeek = newDate.getDay();
      weekStart.setDate(
        newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      );

      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return date;
      });

      setSelectedDates(weekDates);
      onChange?.(weekDates);
    }
  };

  const handleMonthChange = (value: string) => {
    setCurrentMonth(ETHIOPIAN_MONTHS.indexOf(value));
  };

  const handleYearChange = (value: string) => {
    setCurrentYear(Number.parseInt(value));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateSelected = (day: number) => {
    if (selectedDates.length === 0) return false;

    // This is simplified - would need proper date comparison
    return selectedDates.some(
      (date) => date.getMonth() === currentMonth && date.getDate() === day
    );
  };

  const isDateInRange = (day: number) => {
    if (selectedDates.length !== 2) return false;

    // This is simplified - would need proper date comparison
    const currentDate = new Date(2023, currentMonth, day);
    return currentDate > selectedDates[0] && currentDate < selectedDates[1];
  };

  const isFirstOrLastInRange = (day: number) => {
    if (selectedDates.length !== 2) return false;

    // This is simplified - would need proper date comparison
    const currentDate = new Date(2023, currentMonth, day);
    return (
      currentDate.getTime() === selectedDates[0].getTime() ||
      currentDate.getTime() === selectedDates[1].getTime()
    );
  };

  // Render days of the month
  const daysInMonth = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // If mode is "month", render months instead of days
  if (mode === "month") {
    return (
      <div className={cn("w-full rounded-md border p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{currentYear}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ETHIOPIAN_MONTHS.map((month, index) => (
            <Button
              key={month}
              variant={currentMonth === index ? "default" : "outline"}
              className="h-10"
              onClick={() => {
                setCurrentMonth(index);
                if (mode === "month") {
                  // Create a date for the 1st day of the selected month
                  const newDate = new Date(2023, index, 1); // This would need actual Ethiopian to Gregorian conversion
                  setSelectedDates([newDate]);
                  onChange?.(newDate);
                }
              }}
            >
              {month}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // If mode is "year", render years instead
  if (mode === "year") {
    const yearRange = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

    return (
      <div className={cn("w-full rounded-md border p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentYear(currentYear - 12)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {yearRange[0]} - {yearRange[yearRange.length - 1]}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentYear(currentYear + 12)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {yearRange.map((year) => (
            <Button
              key={year}
              variant={currentYear === year ? "default" : "outline"}
              className="h-10"
              onClick={() => {
                setCurrentYear(year);
                if (mode === "year") {
                  // Create a date for the 1st day of the 1st month of the selected year
                  const newDate = new Date(year, 0, 1); // This would need actual Ethiopian to Gregorian conversion
                  setSelectedDates([newDate]);
                  onChange?.(newDate);
                }
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full rounded-md border p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Select
            value={ETHIOPIAN_MONTHS[currentMonth]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {ETHIOPIAN_MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {ETHIOPIAN_WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day.substring(0, 1)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <Button
            key={day}
            variant="ghost"
            className={cn(
              "h-9 w-9 p-0 font-normal",
              isDateSelected(day) &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isFirstOrLastInRange(day) &&
                "rounded-none first:rounded-l last:rounded-r bg-primary text-primary-foreground",
              isDateInRange(day) &&
                "rounded-none bg-primary/50 text-primary-foreground"
            )}
            onClick={() => handleDateClick(day)}
            onMouseEnter={() =>
              mode === "range" &&
              selectedDates.length === 1 &&
              setHoverDate(new Date(2023, currentMonth, day))
            }
            onMouseLeave={() => setHoverDate(null)}
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  );
}
