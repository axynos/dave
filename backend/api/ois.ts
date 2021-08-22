import axios from 'axios'

const apiBase = 'https://ois2.ut.ee/api'

// LEFT OFF CREATING A MORE STRUCTURED WAY TO CALL THE API
// CREATE ENUM FOR APIs AND THEN MAP THE ROUTES TO A JS OBJECT

const base = axios.create({
  baseURL: apiBase
})

const academic = axios.create({
  baseURL: `${apiBase}/academic`
})

const request = async (api, route, returnProperties) => {
  const response = await api.get(route)
  const data = response['data']

  return data
}

const routes = {
  academic: {
    semesterInfo: '/semester-info',
    currentYear: '/year',
    specificYear: (year: number) => `/year/${year}`
  }
}

export const previousSemester = async () => {
  const response = await academic.get(routes.academic.semesterInfo)
  const data = response['data']['previous']
  return data
}

export const currentSemester = async () => {
  const response = await academic.get(routes.academic.semesterInfo)
  const data = response['data']['current']
  return data
}

export const nextSemester = async () => {
  const response = await academic.get(routes.academic.semesterInfo)
  const data = response['data']['next']
  return data
}

export const currentAcademicYear = async () => {
  const response = await academic.get(routes.academic.currentYear)
  const data = response.data

  return data
}
export const specificAcademicYear = (year: number) => academic.get(routes.academic.specificYear(year))

