import axios from 'axios'
import retry from 'axios-retry'
import rateLimit from 'axios-rate-limit'

const baseURL = 'https://ois2.ut.ee/api'

// The ÕIS2 API doesn't respond with status 429
// for rate limiting, rather just times out the
// request. Shorten the delay as the API is
// usually very fast.
// Also, implement our own rate limit to reduce
// the chances of getting ratelimited from the
// server's side.
const base = rateLimit(axios.create({
  baseURL: baseURL,
  timeout: 5000
}), {
  maxRequests: 300, // based on testing, your mileage may vary
  perMilliseconds: 1000
})

// Enable exponential backoff for the ÕIS API client.
retry(base, {
  shouldResetTimeout: true,
  retryDelay: retry.exponentialDelay
})

const apis = {
  academic: '/academic',
  timetable: '/timetable',
  courses: '/courses'
}

const routes = {
  academic: {
    semesterInfo: '/semester-info',
    currentYear: '/year',
    specificYear: (year: number) => `/year/${year}`
  },
  timetable: {
    list: '/',
    course: (versionId: string) => `/courses/${versionId}`
  },
  courses: {
    list: '/',
    details: (courseId: string) => `/${courseId}/details`,
    version: (courseId: string, versionId: string) => `/${courseId}/versions/${versionId}`,
    minVersions: (courseId: string) => `/${courseId}/versions/min`
  }
}

const get = async (api: string, route: string) => {
  const path = `${api}/${route}`
  const response = await base.get(path)
  const data = response['data']

  return data
}

const post = async (api: string, route: string, options={}) => {
  const path = `${api}/${route}`
  const response = await base.post(path, options)
  const data = response.data

  return data
}

export const previousSemester = async () => {
  const response = await get(apis.academic, routes.academic.semesterInfo)
  const data = response['previous']
  return data
}

export const currentSemester = async () => {
  const response = await get(apis.academic, routes.academic.semesterInfo)
  const data = response['current']
  return data
}

export const nextSemester = async () => {
  const response = await get(apis.academic, routes.academic.semesterInfo)
  const data = response['next']
  return data
}

export const currentAcademicYear = async () => {
  const response = await get(apis.academic, routes.academic.currentYear)
  return response
}

export const specificAcademicYear = async (year: number) => {
  const response = await get(apis.academic, routes.academic.specificYear(year))
  return response
}

export interface CourseListOptions {
  academicYear?: number
  lecturers?: string[] // lecturer uuid-s
  statuses?: string[] // confirmed/archived etc
  studyLevels?: string[] // bachelor/master
  start?: number
  take?: number
}

const defaultCourseListOptions = {
  start: 1,
  take: 10
}

export const courseList = async (options?: CourseListOptions) => {
  // Anything passed to the function will either
  // add a new property or overwrite the existing default.
  const requestOptions = {
    ...defaultCourseListOptions,
    ...options
  }

  const response = await post(apis.courses, routes.courses.list, requestOptions)

  return response
}

export const fullCourseList = async (options?: CourseListOptions) => {
  const allCourses = ['hello']

  return allCourses
}

export const courseVersionsMin = async (courseId: string) => {
  const response = await get(apis.courses, routes.courses.minVersions(courseId))

  return response
}

interface CourseVersion {
  uuid: string
  last_update: string
}

export const latestCourseVersion = async (courseId: string) => {
  const minVersions = await courseVersionsMin(courseId)
  const latest = minVersions.reduce((a: CourseVersion, b: CourseVersion) => (a.last_update > b.last_update ? a : b))

  return latest
}

export const courseTimetable = async (versionId: string) => {
  const timetable = await get(apis.timetable, routes.timetable.course(versionId))

  return timetable
}
