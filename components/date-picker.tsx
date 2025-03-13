import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import { cn } from "@lib/utils"

import { EthiopianCalendar } from "./ethiopian-calendar"
import { ETHIOPIAN_MONTHS } from "../utils/constants"
import { formatEthiopianDate, formatEthiopianDateRange } from "../utils/date-utils"

export interface DatePickerProps {
  mode?: "single" | "range" | "week" | "month" | "year"
  className?: string
  placeholder?: string
  value?: Date | Date[]
  onChange?: (date: Date | Date[]) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function EthiopianDatePicker({
  mode = "single",
  className,
  placeholder = "Pick a date",
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) {
  const [date, setDate] = useState<Date | Date[] | undefined>(value)
  const [open, setOpen] = useState(false)

  // Helper function to format the selected date(s) for display
  const formatSelectedDate = () => {
    if (!date) return placeholder

    if (Array.isArray(date)) {
      if (date.length === 0) return placeholder
      if (date.length === 1) return formatEthiopianDate(date[0])
      if (date.length === 2) return formatEthiopianDateRange(date[0], date[1])
      if (date.length === 7) return `Week of ${formatEthiopianDate(date[0])}`
      return `${date.length} dates selected`
    }

    if (mode === "month") {
      const monthIndex = date.getMonth()
      return `${ETHIOPIAN_MONTHS[monthIndex]} ${date.getFullYear()}`
    }

    if (mode === "year") {
      return date.getFullYear().toString()
    }

    return formatEthiopianDate(date)
  }

  const handleDateChange = (newDate: Date | Date[]) => {
    setDate(newDate)
    onChange?.(newDate)

    // Close the popover for single date, month, year, and week selections
    // For range, only close when both dates are selected
    if (
      mode === "single" ||
      mode === "month" ||
      mode === "year" ||
      mode === "week" ||
      (mode === "range" && Array.isArray(newDate) && newDate.length === 2)
    ) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatSelectedDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <EthiopianCalendar mode={mode} value={date} onChange={handleDateChange} minDate={minDate} maxDate={maxDate} />
      </PopoverContent>
    </Popover>
  )
}

