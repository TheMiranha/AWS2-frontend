export function appendToPlural(number: number, string: string) {
  return number > 1 ? string + 's' : string
}