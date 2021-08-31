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

export interface AcademicYear {
  code: string
  en: string
  et: string
}

// If we want to enable smart
// semester detection, we will need
// to add in the registration period property.
export interface Semester {
  start: string
  end: string
  academic_year: AcademicYear
}
