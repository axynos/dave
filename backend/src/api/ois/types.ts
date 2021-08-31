export interface Course {
  uuid: string
  code: string
  state: CourseState
  updatedAt: Date
  title: CourseTitle
  credits: number
}

export interface CourseTitle {
  en: string
  et: string
}

export interface CourseState {
  code: string
  en?: string
  et?: string
}

export interface CourseVersion {
  uuid: string
  last_update: string
}

export interface CourseListOptions {
  academic_year?: number
  lecturers?: string[] // lecturer uuid-s
  states?: CourseState[]
  study_levels?: string[] // bachelor/master
  start?: number
  take?: number
}
