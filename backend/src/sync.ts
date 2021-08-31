import { currentSemester, fullCourseList, latestCourseVersion, courseTimetable, currentAcademicYear } from 'api/ois'
import { CourseVersion, CourseListOptions } from 'types/ois'
import { semesterAcademicWeeks } from 'lib/academicWeeks'

const sync = async () => {
  const semester = await currentSemester()
  const year = Number.parseInt(semester['academic_year']['code'])
  console.log('academic year:', year)

  const courseListOptions: CourseListOptions = {
    academic_year: year,
    states: [{
      code: 'confirmed'
    }],
    lecturers: [],
    study_levels: []
  }

  const courses = await fullCourseList(courseListOptions)
  console.log('courses: ', courses.length)

  const latestVersionRequests = courses.map(async (course) => {
    const latestVersion: CourseVersion | {} = await latestCourseVersion(course.uuid)
    return latestVersion
  })

  const latestVersions = await Promise.all(latestVersionRequests)

  const filteredVersions = latestVersions.filter(version => {
    if (Object.keys(version).length == 0) return false
    return true
  })

  console.log('non-empty course versions:', filteredVersions.length)

  const timetableRequests = filteredVersions.map(async (version: any) => {
    const timetable = (await courseTimetable(version['uuid']))
    return timetable
  })

  const timetables = await Promise.all(timetableRequests)

  console.log('timetable count:', timetables.length)
  console.log(`Found and requested data for ${timetables.length} timetables.`)

  const weeks = semesterAcademicWeeks(semester)
  console.log('academic weeks', weeks)

  // return timetables[0]
  return weeks
}

export default sync
