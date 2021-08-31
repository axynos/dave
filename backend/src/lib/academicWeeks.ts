import { nextSunday, eachWeekOfInterval } from 'date-fns'
import { AcademicWeek } from 'types/academic'
import { Semester } from 'types/ois'
import { parseISO } from 'date-fns'

export const academicWeeks = (interval: Interval) => {
  const weekStarts = eachWeekOfInterval(interval, { weekStartsOn: 1 /* 1=Monday */ })
  const weeks: AcademicWeek[] = weekStarts.map(weekStart => ({
    start: weekStart,
    end: nextSunday(weekStart)
  }))


  return weeks
}

export const semesterAcademicWeeks = (semester: Semester) => {
  const start = parseISO(semester['start'])
  const end = parseISO(semester['end'])
  const weeks = academicWeeks({ start, end })

  return weeks
}
