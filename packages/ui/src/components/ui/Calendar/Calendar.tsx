"use client"

import * as React from "react"
import { cn } from "cn"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "../Button"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("ui-calendar group/calendar", className)}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("ui-calendar__root", defaultClassNames.root),
        months: cn("ui-calendar__months", defaultClassNames.months),
        month: cn("ui-calendar__month", defaultClassNames.month),
        nav: cn("ui-calendar__nav", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "ui-calendar__button-previous",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "ui-calendar__button-next",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "ui-calendar__month-caption",
          defaultClassNames.month_caption
        ),
        dropdowns: cn("ui-calendar__dropdowns", defaultClassNames.dropdowns),
        dropdown_root: cn(
          "ui-calendar__dropdown-root",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("ui-calendar__dropdown", defaultClassNames.dropdown),
        caption_label: cn(
          "ui-calendar__caption-label",
          captionLayout !== "label" && "ui-calendar__caption-label--dropdown",
          defaultClassNames.caption_label
        ),
        month_grid: cn("ui-calendar__month-grid", defaultClassNames.month_grid),
        weekdays: cn("ui-calendar__weekdays", defaultClassNames.weekdays),
        weekday: cn("ui-calendar__weekday", defaultClassNames.weekday),
        week: cn("ui-calendar__week", defaultClassNames.week),
        week_number_header: cn(
          "ui-calendar__week-number-header",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "ui-calendar__week-number",
          defaultClassNames.week_number
        ),
        day: cn(
          "ui-calendar__day group/day",
          props.showWeekNumber && "ui-calendar__day--with-week-number",
          defaultClassNames.day
        ),
        range_start: cn(
          "ui-calendar__range-start",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "ui-calendar__range-middle",
          defaultClassNames.range_middle
        ),
        range_end: cn("ui-calendar__range-end", defaultClassNames.range_end),
        today: cn("ui-calendar__today", defaultClassNames.today),
        outside: cn("ui-calendar__outside", defaultClassNames.outside),
        disabled: cn("ui-calendar__disabled", defaultClassNames.disabled),
        hidden: cn("ui-calendar__hidden", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("ui-calendar__chevron", className)}
                {...props}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("ui-calendar__chevron", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn("ui-calendar__chevron", className)}
              {...props}
            />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="ui-calendar__week-number__div">{children}</div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn("ui-calendar-day-button", defaultClassNames.day, className)}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
