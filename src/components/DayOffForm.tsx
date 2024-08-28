'use client'

import * as React from "react"
import { addDays, format, subDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function Component() {
  const today = new Date()
  const minDate = subDays(today, 1)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 1),
  })
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(new Date())
  const [isSingleDay, setIsSingleDay] = React.useState(false)

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (isSingleDay && newDate?.from) {
      setDate({ from: newDate.from, to: newDate.from })
    } else {
      setDate(newDate)
    }
  }

  const handleSingleDayToggle = (checked: boolean) => {
    setIsSingleDay(checked)
    if (checked) {
      setDate({ from: today, to: today })
    } else {
      setDate({ from: today, to: addDays(today, 1) })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-[400px] border-accent">
        <CardHeader className="bg-accent text-accent-foreground">
          <CardTitle>Day Off Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="dayOffType">Day Off Type</Label>
              <Select>
                <SelectTrigger id="dayOffType" className="border-accent">
                  <SelectValue placeholder="Select a day off type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leaveDay">Leave Day</SelectItem>
                  <SelectItem value="travelDay">Travel Day</SelectItem>
                  <SelectItem value="pointsOffDay">Points Off Day</SelectItem>
                  <SelectItem value="travelAndPointsOffDay">Travel & Points Off Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="singleDay">Single Day</Label>
              <Switch
                id="singleDay"
                checked={isSingleDay}
                onCheckedChange={handleSingleDayToggle}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="space-y-2">
              <Label>{isSingleDay ? "Date" : "Date Range"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-accent",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      isSingleDay ? (
                        format(date.from, "LLL dd, y")
                      ) : date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {
                    isSingleDay ?
                      <Calendar
                        initialFocus
                        mode={"single"}
                        defaultMonth={new Date()}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={1}
                        disabled={(date) => date < minDate}
                        className="border-accent"
                        classNames={{
                          day_selected: "bg-accent text-accent-foreground",
                          day_today: "",
                        }}
                      />

                      :
                      <Calendar
                        initialFocus
                        mode={"range"}
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={isSingleDay ? 1 : 2}
                        disabled={(date) => date < minDate}
                        fromDate={minDate}
                        className="border-accent"
                        classNames={{
                          day_selected: "bg-accent text-accent-foreground",
                          day_today: "bg-accent text-accent-foreground",
                        }}
                      />
                  }

                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about your day off request here"
                className="min-h-[100px] border-accent"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Submit Request</Button>
        </CardFooter>
      </Card>
    </div>
  )
}