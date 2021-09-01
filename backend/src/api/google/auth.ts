// Google Service Account authentication was originally stolen from
// https://stackoverflow.com/questions/58565907/google-sheets-api-authorization-with-a-service-account
// Current solution is modified to not need an async function, greatly simplifying the importing.

import credentials from 'auth/credentials.json'
import { Auth } from 'googleapis' // types
import { google } from 'googleapis'

// HTTP/2 Support is stable now, enable it.
google.options({
  http2: true
})

const { client_email, private_key } = credentials // eslint-disable-line
let authClient: undefined | Auth.JWT

// Authenticates with Google services using credentials stored in the credentials.json file.
const createAuthClient = () => {
  const JwtClient = new google.auth.JWT(
    client_email,
    undefined,
    private_key,
    [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar'
    ]
  )

  authClient = JwtClient
  return authClient
}

// Returns an already created or a new JWT auth object for communicating with Google services.
const getAuth = () => authClient || createAuthClient()

// Get an authenticated base Google Sheets API client.
export const sheetsBase = (() => google.sheets({ version: 'v4', auth: getAuth() }))()

// Get an authenticated Google Sheets API client.
export const sheets = (() => sheetsBase.spreadsheets.values)()

// Get an authenticated Google Calendar API client.
export const calendar = (() => google.calendar({ version: 'v3', auth: getAuth() }))()

export default getAuth

