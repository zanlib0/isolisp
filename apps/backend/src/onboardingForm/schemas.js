import { lisp } from '@isolisp/dsl'
import { isInteger, moreThanZero, required, timeOffFullTimeHalfOfWorkingHours, workingHoursFullTimeMoreThan36Hours, workingHoursPartTimeLimit } from './rules.js'

export const onboardingSchema = {
  submit: { method: 'POST', url: '/api/onboarding' },
  fields: [
    {
      name: 'schedule',
      label: 'Schedule',
      type: 'radio',
      options: [
        { label: 'Full-time', value: 'full' },
        { label: 'Part-time', value: 'part' },
      ],
      validations: [
        { rule: required, message: 'Schedule required' },
      ],
    },
    {
      name: 'workingHours',
      label: 'Working hours',
      type: 'input',
      validations: [
        { rule: required, message: 'Working hours required.' },
        { rule: isInteger, message: 'Working hours must be a number.' },
        { rule: moreThanZero, message: 'Working hours must be more than 0.' },
        { rule: workingHoursFullTimeMoreThan36Hours, message: 'It cannot be less than 36 hours per week.' },
        { rule: workingHoursPartTimeLimit, message: 'A part-timer cannot work more than 35 hours.' },
      ],
    },
    {
      name: 'timeOffDays',
      label: 'Time-off days',
      type: 'input',
      validations: [
        { rule: required, message: 'Time-off days required.' },
        { rule: isInteger, message: 'Time-off days must be a number.' },
        { rule: moreThanZero, message: 'Time-off days must be more than 0.' },
        { rule: timeOffFullTimeHalfOfWorkingHours, message: 'It has to be at least half of working hours.' },
      ],
    },
    {
      name: 'holidayBonus',
      label: 'Holiday bonus',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Once a year', value: 'onceAYear' },
      ],
      visibility: lisp(`(lambda () (eq @schedule "full"))`),
      validations: [
        { rule: required, message: 'Holiday bonus required.' },
      ],
    },
  ],
}
