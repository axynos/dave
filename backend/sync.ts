import { currentAcademicYear} from 'api/ois'

const test = async () => {
  const res = await currentAcademicYear
  return res['data']
}

export default test
