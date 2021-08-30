import { get, api } from '../ois'

const routes = {
  list: '/',
  course: (versionId: string) => `/courses/${versionId}`
}

export const courseTimetable = async (versionId: string) => {
  const timetable = await get(api.timetable, routes.course(versionId))

  return timetable
}
