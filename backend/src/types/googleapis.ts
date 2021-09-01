import { calendar_v3 } from 'googleapis'
import Schema$Event = calendar_v3.Schema$Event

export interface EventMoveParameters {
  fromCalendarId: string
  toCalendarId: string
  eventId: string
}

export interface EventUpdateParameters {
  calendarId: string
  eventId: string
  event: Schema$Event
}

export interface EventDeleteParameters {
  calendarId: string
  eventId: string
}
