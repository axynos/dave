import { fullCourseList, latestCourseVersion, courseTimetable, currentAcademicYear } from 'api/ois'
import { Course, CourseVersion, CourseListOptions } from 'api/ois/types'

const sync = async () => {
  const year = (await currentAcademicYear())['academic_year']['code']
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
  console.log('timetables:', timetables.length)

  console.log(`Found and requested data for ${timetables.length} timetables.`)

  return timetables[0]
}

export default sync
