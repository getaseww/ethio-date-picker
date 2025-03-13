import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { cn } from "@lib/utils"

import { ETHIOPIAN_MONTHS, ETHIOPIAN_WEEKDAYS_SHORT } from "../utils/constants"
import { getDaysInMonth, type EthiopianDate, convertToGregorianDate } from "../utils/date-utils"

export interface EthiopianCalendarProps {
  value?: Date | Date[]
  onChange?: (date: Date | Date[]) => void
  mode?: "single" | "range" | "week" | "month" | "year"
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function EthiopianCalendar({
  value,
  onChange,
  mode = "single",
  className,
  minDate,
  maxDate,
}: EthiopianCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(0) // 0-indexed (0 = መስከረም)
  const [currentYear, setCurrentYear] = useState(2016) // Current Ethiopian year
  const [selectedDates, setSelectedDates] = useState<Date[]>(Array.isArray(value) ? value : value ? [value] : [])
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  // Generate years for the dropdown (range of 20 years)
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i)

  const handleDateClick = (day: number) => {
    // Create a date object for the selected Ethiopian date
    const ethiopianDate: EthiopianDate = {
      year: currentYear,
      month: currentMonth,
      day: day,
    }

    // Convert to Gregorian date for JavaScript Date compatibility
    const newDate = convertToGregorianDate(ethiopianDate)

    // Check if date is within allowed range
    if ((minDate && newDate < minDate) || (maxDate && newDate > maxDate)) {
      return
    }

    if (mode === "single") {
      setSelectedDates([newDate])
      onChange?.(newDate)
    } else if (mode === "range") {
      if (selectedDates.length === 0 || selectedDates.length === 2) {
        setSelectedDates([newDate])
      } else {
        const rangeStart = selectedDates[0]
        const rangeEnd = newDate > rangeStart ? newDate : rangeStart
        const updatedRange = [rangeStart < newDate ? rangeStart : newDate, rangeEnd]
        setSelectedDates(updatedRange)
        onChange?.(updatedRange)
      }
    } else if (mode === "week") {
      // Calculate the week based on the selected day
      const weekStart = new Date(newDate)
      const dayOfWeek = newDate.getDay()
      weekStart.setDate(newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        return date
      })

      setSelectedDates(weekDates)
      onChange?.(weekDates)
    }
  }

  const handleMonthChange = (value: string) => {
    setCurrentMonth(ETHIOPIAN_MONTHS.indexOf(value))
  }

  const handleYearChange = (value: string) => {
    setCurrentYear(Number.parseInt(value))
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const isDateSelected = (day: number) => {
    if (selectedDates.length === 0) return false

    // This is simplified - would need proper date comparison
    return selectedDates.some((date) => {
      const ethiopianDate = {
        year: currentYear,
        month: currentMonth,
        day: day,
      }
      const currentDate = convertToGregorianDate(ethiopianDate)
      return date.getTime() === currentDate.getTime()
    })
  }

  const isDateInRange = (day: number) => {
    if (selectedDates.length !== 2) return false

    const ethiopianDate = {
      year: currentYear,
      month: currentMonth,
      day: day,
    }
    const currentDate = convertToGregorianDate(ethiopianDate)
    return currentDate > selectedDates[0] && currentDate < selectedDates[1]
  }

  const isFirstOrLastInRange = (day: number) => {
    if (selectedDates.length !== 2) return false

    const ethiopianDate = {
      year: currentYear,
      month: currentMonth,
      day: day,
    }
    const currentDate = convertToGregorianDate(ethiopianDate)
    return currentDate.getTime() === selectedDates[0].getTime() || currentDate.getTime() === selectedDates[1].getTime()
  }

  const isDateDisabled = (day: number) => {
    if (!minDate && !maxDate) return false

    const ethiopianDate = {
      year: currentYear,
      month: currentMonth,
      day: day,
    }
    const currentDate = convertToGregorianDate(ethiopianDate)

    return (minDate && currentDate < minDate) || (maxDate && currentDate > maxDate)
  }

  // Render days of the month
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // If mode is "month", render months instead of days
  if (mode === "month") {
    return (
      <div className={cn("w-full rounded-md border p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentYear(currentYear - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{currentYear}</div>
          <Button variant="outline" size="icon" onClick={() => setCurrentYear(currentYear + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ETHIOPIAN_MONTHS.map((month, index) => {
            const isDisabled =
              (minDate || maxDate) &&
              ((minDate && currentYear < minDate.getFullYear()) ||
                (maxDate && currentYear > maxDate.getFullYear()) ||
                (minDate && currentYear === minDate.getFullYear() && index < minDate.getMonth()) ||
                (maxDate && currentYear === maxDate.getFullYear() && index > maxDate.getMonth()))

            return (
              <Button
                key={month}
                variant={currentMonth === index ? "default" : "outline"}
                className="h-10"
                disabled={isDisabled}
                onClick={() => {
                  setCurrentMonth(index)
                  if (mode === "month") {
                    const ethiopianDate = {
                      year: currentYear,
                      month: index,
                      day: 1,
                    }
                    const newDate = convertToGregorianDate(ethiopianDate)
                    setSelectedDates([newDate])
                    onChange?.(newDate)
                  }
                }}
              >
                {month}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  // If mode is "year", render years instead
  if (mode === "year") {
    const yearRange = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i)

    return (
      <div className={cn("w-full rounded-md border p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentYear(currentYear - 12)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {yearRange[0]} - {yearRange[yearRange.length - 1]}
          </div>
          <Button variant="outline" size="icon" onClick={() => setCurrentYear(currentYear + 12)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {yearRange.map((year) => {
            const isDisabled = (minDate && year < minDate.getFullYear()) || (maxDate && year > maxDate.getFullYear())

            return (
              <Button
                key={year}
                variant={currentYear === year ? "default" : "outline"}
                className="h-10"
                disabled={isDisabled}
                onClick={() => {
                  setCurrentYear(year)
                  if (mode === "year") {
                    const ethiopianDate = {
                      year: year,
                      month: 0,
                      day: 1,
                    }
                    const newDate = convertToGregorianDate(ethiopianDate)
                    setSelectedDates([newDate])
                    onChange?.(newDate)
                  }
                }}
              >
                {year}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full rounded-md border p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Select value={ETHIOPIAN_MONTHS[currentMonth]} onValueChange={handleMonthChange}>
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
          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
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
        {ETHIOPIAN_WEEKDAYS_SHORT.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
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
              isDateInRange(day) && "rounded-none bg-primary/50 text-primary-foreground",
            )}
            disabled={isDateDisabled(day)}
            onClick={() => handleDateClick(day)}
            onMouseEnter={() =>
              mode === "range" &&
              selectedDates.length === 1 &&
              setHoverDate(
                convertToGregorianDate({
                  year: currentYear,
                  month: currentMonth,
                  day: day,
                }),
              )
            }
            onMouseLeave={() => setHoverDate(null)}
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  )
}

