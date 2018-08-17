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

export function replaceAll(str: string, toReplace: string, replacement: string): string {
  str = str.replace(new RegExp(toReplace, 'g'), replacement)
  return str
}

export function prependZeros(str: string, desiredLength: number): string {
  if (str.length > desiredLength) {
    return str
  }
  let count = desiredLength - str.length
  return '0'.repeat(count) + str
}
