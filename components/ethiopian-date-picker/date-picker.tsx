import { useState } from "react";
import * as dayjs from 'dayjs'
import { CalendarIcon } from "lucide-react";

import { Button } from "components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn } from "@lib/utils";
import { EthiopianCalendar, ETHIOPIAN_MONTHS } from "./ethiopian-calendar";

interface DatePickerProps {
  mode?: "single" | "range" | "week" | "month" | "year";
  className?: string;
}

export function EthiopianDatePicker({
  mode = "single",
  className,
}: DatePickerProps) {
  const [date, setDate] = useState<Date | Date[] | undefined>(undefined);
  const [calendarMode, setCalendarMode] = useState<
    "single" | "range" | "week" | "month" | "year"
  >(mode);
  const [open, setOpen] = useState(false);

  // Helper function to format the selected date(s) for display
  const formatSelectedDate = () => {
    if (!date) return "Pick a date";

    if (Array.isArray(date)) {
      if (date.length === 0) return "Pick a date";
      if (date.length === 1) return formatEthiopianDate(date[0]);
      if (date.length === 2)
        return `${formatEthiopianDate(date[0])} - ${formatEthiopianDate(
          date[1]
        )}`;
      if (date.length === 7) return `Week of ${formatEthiopianDate(date[0])}`;
      return `${date.length} dates selected`;
    }

    if (calendarMode === "month") {
      const monthIndex = date.getMonth();
      return `${ETHIOPIAN_MONTHS[monthIndex]} ${date.getFullYear()}`;
    }

    if (calendarMode === "year") {
      return date.getFullYear().toString();
    }

    return formatEthiopianDate(date);
  };

  // This is a simplified function - would need proper Gregorian to Ethiopian conversion
  const formatEthiopianDate = (date: Date) => {
    // In a real implementation, this would convert from Gregorian to Ethiopian
    return dayjs(date).format("DD/MM/YYYY");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatSelectedDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs
          defaultValue={calendarMode}
          onValueChange={(value) => setCalendarMode(value as any)}
        >
          <TabsContent value="single" className="p-0">
            <EthiopianCalendar
              mode="single"
              value={Array.isArray(date) ? date[0] : date}
              onChange={(newDate) => {
                setDate(newDate);
                setOpen(false);
              }}
            />
          </TabsContent>
          <TabsContent value="range" className="p-0">
            <EthiopianCalendar
              mode="range"
              value={Array.isArray(date) ? date : date ? [date] : undefined}
              onChange={(newDate) => {
                setDate(newDate);
                if (Array.isArray(newDate) && newDate.length === 2) {
                  setOpen(false);
                }
              }}
            />
          </TabsContent>
          <TabsContent value="week" className="p-0">
            <EthiopianCalendar
              mode="week"
              value={Array.isArray(date) ? date : date ? [date] : undefined}
              onChange={(newDate) => {
                setDate(newDate);
                setOpen(false);
              }}
            />
          </TabsContent>
          <TabsContent value="month" className="p-0">
            <EthiopianCalendar
              mode="month"
              value={Array.isArray(date) ? date[0] : date}
              onChange={(newDate) => {
                setDate(Array.isArray(newDate) ? newDate[0] : newDate);
                setOpen(false);
              }}
            />
          </TabsContent>
          <TabsContent value="year" className="p-0">
            <EthiopianCalendar
              mode="year"
              value={Array.isArray(date) ? date[0] : date}
              onChange={(newDate) => {
                setDate(Array.isArray(newDate) ? newDate[0] : newDate);
                setOpen(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
