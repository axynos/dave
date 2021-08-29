import { courseList, latestCourseVersion, courseTimetable, currentAcademicYear } from 'api/ois'

interface CourseVersion {
  uuid: string
}

const sync = async () => {
  const year = (await currentAcademicYear())['academic_year']['code']
  const courses = (await courseList({ academicYear: year, take: 50 }))

  const latestVersionRequests = courses.map(async (course: any) => {
    const latestVersion: CourseVersion = (await latestCourseVersion(course['uuid']))
    return latestVersion
  })

  const latestVersions = await Promise.all(latestVersionRequests)

  const timetableRequests = latestVersions.map(async (version: any) => {
    const timetable = (await courseTimetable(version['uuid']))
    return timetable
  })

  const timetables = await Promise.all(timetableRequests)

  return timetables
}

export default sync
