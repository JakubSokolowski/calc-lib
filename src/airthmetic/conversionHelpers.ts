export function representationStrToStrList(str: string, radix: number): string[] {
  if (radix <= 36) {
    return str.split('')
  } else {
    return str.split(' ')
  }
}

export function removeTrailingZerosAndSpaces(str: string): string {
  let invalidCharCount = 0
  for (let i = str.length - 1; i >= 0; i--) {
    if (str.charAt(i) === '0' || str.charAt(i) === ' ') {
      invalidCharCount++
    } else {
      break
    }
  }
  str = str.substr(0, str.length - invalidCharCount)
  if (str.endsWith('.') || str.endsWith(',')) {
    str = str.substr(0, str.length - 1)
  }
  return str
}
