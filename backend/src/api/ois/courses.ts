import { get, post, api } from '../ois'
import { Course, CourseVersion, CourseListOptions } from 'types/ois'

const routes = {
    list: '/',
    details: (courseId: string) => `/${courseId}/details`,
    version: (courseId: string, versionId: string) => `/${courseId}/versions/${versionId}`,
    minVersions: (courseId: string) => `/${courseId}/versions/min`
}

export const courseList = async (options?: CourseListOptions) => {
  const defaultCourseListOptions = {
    start: 1,
    take: 10
  }

  // Anything passed to the function will either
  // add a new property or overwrite the existing default.
  const requestOptions = {
    ...defaultCourseListOptions,
    ...options
  }

  const response = await post(api.courses, routes.list, requestOptions)

  return response
}

const createCourseListIterator = (start=1, end=Infinity, step=30, options?: CourseListOptions) => {
  let nextIndex = start
  let courses: Course[] = []
  let shouldStop = false

  const courseListIterator = {
    next: async () => {
      let result
      if ((nextIndex < end) && (shouldStop === false)) {
        const response = await courseList({...options, start: nextIndex, take: step })
        courses = courses.concat(response)

        if (response.length === 0) {
          shouldStop = true
        }

        result = { value: response, done: false }
        nextIndex += step

        return result
      }
      return { value: courses, done: true }
    }
  }

  return courseListIterator
}

export const fullCourseList = async (options?: CourseListOptions) => {
  const courseListIterator = createCourseListIterator(1, Infinity, 100, options)

  let result = await courseListIterator.next()
  while (result.done === false) {
    result = await courseListIterator.next()
  }

  return result.value as Course[]
}

export const courseVersionsMin = async (courseId: string) => {
  const response: CourseVersion[] = await get(api.courses, routes.minVersions(courseId))

  return response
}

export const latestCourseVersion = async (courseId: string) => {
  const minVersions = await courseVersionsMin(courseId)
  if (minVersions.length == 0) return {}

  const latest = minVersions.reduce((a: CourseVersion, b: CourseVersion) => (
    a.last_update > b.last_update ? a : b
  ))

  return latest
}
