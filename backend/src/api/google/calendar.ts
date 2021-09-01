import { pRateLimit } from 'p-ratelimit'
import { calendar } from 'api/google/auth'
import { calendar_v3 } from 'googleapis' // types
import Schema$Event = calendar_v3.Schema$Event
import {
  EventDeleteParameters,
  EventUpdateParameters,
  EventMoveParameters
} from 'types/googleapis'

/*
 Google Calendar Documentation
 Overview: https://developers.google.com/calendar/concepts
 Event: https://developers.google.com/calendar/v3/reference/events
 Errors: https://developers.google.com/calendar/v3/errors
 */

// Dave shouldn't hit the ratelimit,
// but I had the ratelimited implementation
// laying around anyway.
const rateLimit = pRateLimit({
  interval: 1000,
  rate: 5,
  concurrency: 1
})

export const createEvent = async (calendarId: string, event: Schema$Event) => {
  if (event.id) {
    throw new Error('Attempting to create a new event when a cached event ID already exists!')
  }

  try {
    const createdEvent = (await rateLimit(() => calendar.events.insert({
      calendarId,
      requestBody: event
    }))).data

    return createdEvent

  } catch (err) {
    throw err
  }
}

// Gets an event from a calendar.
export const getEvent = async (calendarId: string, eventId: string) => {
  try {
    const returnedEvent = (await rateLimit(() => calendar.events.get({
      calendarId,
      eventId
    }))).data

    return returnedEvent

  } catch (err) {
    return {
      error: true,
      info: {
        status: err.code,
        statusMessage: err.message,
        errors: err.errors
      }
    }
  }
}


/** @todo Implement this method. */
export const getEvents = async () => { throw new Error('Function is not implemented yet.') }

// Gets up to 2500 events from a given calendar.
export const listEvents = async (calendarId: string) => {
  try {
    const returnedEvents = (await rateLimit(() => calendar.events.list({
      calendarId,
      maxResults: 2500 // Avoid implementing pagination.
    }))).data.items

    return returnedEvents

  } catch (err) {
    throw err
  }
}

// Moves event to a different calendar.
export const moveEvent = async (calendarIdOld: string, calendarIdNew: string, eventId: string) => {
  try {
    const movedEvent = (await rateLimit(() => calendar.events.move({
      calendarId: calendarIdOld,
      eventId,
      destination: calendarIdNew
    }))).data

    return movedEvent
  } catch (err) {
    throw err
  }
}

/**
 * Parameters used for event update and upsert requests.
 * @typedef  {object}    eventMoveParameters
 * @property {string}    from
 * @property {string}    to
 * @property {string}    id
 */

// Updates given events.
export const moveEvents = async (eventsToMove: EventMoveParameters[]) => {
  const requests = eventsToMove.map(params => (
    moveEvent(params.fromCalendarId, params.toCalendarId, params.eventId)
  ))

  return Promise.all(requests)
}

// Updates the event in the specified Google Calendar.
export const updateEvent = async (calendarId: string, eventId: string, event: Schema$Event) => {
  try {
    const updatedEvent = (await rateLimit(() => calendar.events.update({
      calendarId,
      eventId,
      requestBody: event
    }))).data

    return updatedEvent

  } catch (err) {
    throw err
  }
}

// Updates given events.
export const updateEvents = async (eventsToUpdate: EventUpdateParameters[]) => {
  const requests = eventsToUpdate.map(params => (
    updateEvent(params.calendarId, params.eventId, params.event)
  ))

  return Promise.all(requests)
}

// Deletes specified event in a calendar.
export const deleteEvent = async (calendarId: string, eventId: string) => {

  try {
    await rateLimit(() => calendar.events.delete({
      calendarId,
      eventId
    }))

    // events.delete returns an empty response.
    return {}

  } catch (err) {
    throw err
  }
}

// Deleted specified events in calendars.
export const deleteEvents = async (eventsToDelete: EventDeleteParameters[]) => {
  const requests = eventsToDelete.map(params => (
    deleteEvent(params.calendarId, params.eventId)
  ))

  return Promise.all(requests)
}

// Clears all events from the specified calendar.
export const clearEvents = async (calendarId: string) => {
  const events = await listEvents(calendarId)

  if (events) {
    const requests = events.map(event => deleteEvent(calendarId, event.id!))
    return Promise.all(requests)
  } else {
    throw new Error(`Listing events for calendar ${calendarId} returned undefined.`)
  }

}
