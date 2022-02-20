export function date2RFC3339(date?: Date | string): string {
   date = date || new Date()
   if (typeof date == 'string') date = new Date(date)
   return date.toISOString()
}

export function date2RFC1123(date?: Date | string): string {
   date = date || new Date()
   if (typeof date == 'string') date = new Date(date)
   return date.toUTCString()
}
