import { format } from 'date-fns'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../composables/constants'
dayjs.extend(relativeTime)

export const formatDate = function (dateString: string) {
  const date = dayjs(dateString)
  // Then specify how you want your dates to be formatted
  // https://day.js.org/docs/en/display/format
  // https://day.js.org/docs/en/display/from-now
  return date.format('DD/MM/YYYY HH:mm')
}

export const formatToDateTime = function (date, formatStr = DATE_TIME_FORMAT): string {
  return format(date, formatStr)
}

export const formatToDate = function (date, formatStr = DATE_FORMAT): string {
  return format(date, formatStr)
}

export const isoDateToEuroDate = function (isoDate: string) {
  const parts = isoDate.split('-')

  return `${parts[2]}.${parts[1]}.${parts[0]}`
}

export const searchAsEuroDate = function (value: string, searchString: string) {
  const parts = searchString.split('.')
  const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`

  return isoDate === value
}

export const isoDateToDate = function (isoDate: string) {
  return new Date(isoDate)
}

export const timeAgo = function (dateString: string) {
  const date = dayjs(dateString)

  return dayjs(date).fromNow()
}
