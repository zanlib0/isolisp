import { lisp } from '@isolisp/dsl'

export const required = lisp(`(lambda (value) (not (eq value "")))`)

export const isInteger = lisp(`(lambda (value) (isInt (toInt value)))`)

export const moreThanZero = lisp(`(lambda (value) (gt value 0))`)

export const workingHoursFullTimeMoreThan36Hours = lisp(`
  (lambda (value)
    (when (eq @schedule "full") (gte value 36) true))
`)

export const workingHoursPartTimeLimit = lisp(`
  (lambda (value)
    (when (eq @schedule "part") (lte value 35) true))
`)

export const timeOffFullTimeHalfOfWorkingHours = lisp(`
  (lambda (value)
    (when (eq @schedule "full")
      (define
        ((halfOfWorkingHours (floor (mul @workingHours 0.5))))
          (gte value halfOfWorkingHours))
      true))
`)

export const ifFullTime = slot => (lisp`(lambda (value) (when (eq @schedule "full") ${slot} true ))`)
export const workingHoursFullTimeMoreThan36HoursMacro = ifFullTime(lisp`(gte value 36)`)
