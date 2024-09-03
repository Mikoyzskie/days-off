"use client"

import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z, ZodType } from "zod"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { subDays } from "date-fns"

type FormData = {
  startDate: Date;
  endDate: Date;
  date: Date;
  description: string;
  single: boolean;
  type: string;
};

const FormSchema: ZodType<FormData> = z.object({
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  description: z.string(),
  type: z.string(),
  single: z.boolean(),
  startDate: z.coerce.date().refine((data) => data > new Date(), { message: "Start date must be in the future" }),
  endDate: z.coerce.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date cannot be earlier than start date.",
  path: ["endDate"],
});

export function CalendarForm() {
  const [isSingleDay, setIsSingleDay] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const today = new Date()
  const minDate = subDays(today, 1)

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(JSON.stringify(data, null, 2));
  }

  const handleSingleChange = useCallback(() => {
    setIsSingleDay(!isSingleDay)
  }, [isSingleDay])

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <div className="space-y-2">
                <FormLabel>Day Off Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormMessage />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="single"
            render={() => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Single Day</FormLabel>
                <FormControl>
                  <Switch
                    id="singleDay"
                    checked={isSingleDay}
                    onCheckedChange={handleSingleChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {isSingleDay ?
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Day Off</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < minDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            :
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Day Off</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
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
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          }
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <Textarea
                  name={field.name}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  placeholder="Add any additional information about your day off request here"
                  className="min-h-[100px] border-accent"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
