import { get, api } from '../ois'

const routes = {
  semesterInfo: '/semester-info',
  currentYear: '/year',
  specificYear: (year: number) => `/year/${year}`
}

export const previousSemester = async () => {
  const response = await get(api.academic, routes.semesterInfo)
  const data = response['previous']
  return data
}

export const currentSemester = async () => {
  const response = await get(api.academic, routes.semesterInfo)
  const data = response['current']
  return data
}

export const nextSemester = async () => {
  const response = await get(api.academic, routes.semesterInfo)
  const data = response['next']
  return data
}

export const currentAcademicYear = async () => {
  const response = await get(api.academic, routes.currentYear)
  return response
}

export const specificAcademicYear = async (year: number) => {
  const response = await get(api.academic, routes.specificYear(year))
  return response
}
