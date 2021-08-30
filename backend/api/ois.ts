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

export const api = {
  academic: '/academic',
  timetable: '/timetable',
  courses: '/courses'
}

export const get = async (api: string, route: string) => {
  const path = `${api}/${route}`
  const response = await base.get(path)
  const data = response['data']

  return data
}

export const post = async (api: string, route: string, requestData={}) => {
  const path = `${api}/${route}`
  const response = await base.post(path, requestData)
  const data = response.data

  return data
}

export * from './ois/courses'
export * from './ois/timetable'
export * from './ois/academic'
