import BigNumber from 'bignumber.js'
import { BaseDigits } from './positional/baseDigits'

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

export function prependStr(toPrepend: string, str: string, desiredLength: number): string {
  if (str.length > desiredLength) {
    return str
  }
  let count = desiredLength - str.length
  return toPrepend[0].repeat(count) + str
}

export function removeZeroDigits(digits: string[]): string[] {
  let invalidDigitCount = 0
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] === '0' || digits[i] === '00') {
      invalidDigitCount++
    } else {
      break
    }
  }
  return digits.slice(0, digits.length - invalidDigitCount)
}

export function arbitraryIntegralToDecimal(valStr: string, radix: number): BigNumber {
  if (isValidString(valStr, radix)) {
    let result = new BigNumber(0)
    let multiplier = 1
    // While converting, the numbers are assumed to be unsigned
    // Detect and remember if number was negative
    if (valStr.charAt(0) === '-') {
      valStr = valStr.substr(1)
      multiplier = -1
    }
    // Digits at positions in some representation are represented by multiple characters,
    // so it's necessary to convert valueString to list of strings
    let strArr = representationStrToStrList(valStr, radix)
    // The value at each position is calculated by taking the value of digit
    // and multiplying it by the base of number to the power of exponent

    // The exponents at positions are as follows:
    // For number 531
    // Exponents:  ...2 1 0
    // Digits:        5 3 1
    // So the starting value of exponent is the count of elements in lis -1
    let exponent = strArr.length - 1
    for (let i = 0; i <= exponent; i++) {
      result = result.plus(
        new BigNumber(BaseDigits.getValue(strArr[i], radix) * Math.pow(radix, exponent - i))
      )
    }
    return result.multipliedBy(multiplier)
  }
  throw new Error('Invalid string for given radix')
}

export function decimalIntegralToArbitrary(num: BigNumber, radix: number): [string[], string[]] {
  if (num.isZero()) {
    return [[BaseDigits.getDigit(0, radix)], []]
  }
  let remainders: string[] = []
  let resultDigits: string[] = []
  let currentNum = num.abs()
  while (!currentNum.isZero()) {
    remainders.push(currentNum.toString())
    let remainder = currentNum.mod(radix)
    resultDigits.push(BaseDigits.getDigit(remainder.toNumber(), radix))
    currentNum = currentNum.dividedToIntegerBy(radix)
  }
  return [resultDigits.reverse(), remainders]
}

export function decimalFractionToArbitrary(
  fraction: BigNumber,
  radix: number,
  precision = 30
): [string[], string[]] {
  if (fraction.isZero()) {
    return [[BaseDigits.getDigit(0, radix)], []]
  }
  if (fraction.isNegative()) {
    fraction = fraction.negated()
  }
  let result: string[] = []
  let num = new BigNumber(0)
  let fractionPart: BigNumber
  let wholePart = 0
  let fractions: string[] = []
  fractionPart = fraction
  for (let i = 0; i < precision; i++) {
    fractions.push(fractionPart.toString())
    num = fractionPart.multipliedBy(radix)
    fractionPart = num.mod(1)
    wholePart = num.minus(fractionPart).toNumber()
    result.push(BaseDigits.getDigit(wholePart, radix))
  }
  result = removeZeroDigits(result)
  fractions = removeZeroDigits(fractions)
  return [result, fractions]
}

export function arbitraryFractionToDecimal(fractionStr: string, radix: number): BigNumber {
  let decimalFraction = new BigNumber(0.0)
  let exponent = 1.0
  let strArr = representationStrToStrList(fractionStr, radix)
  // The exponents at positions in fraction are as follows:
  // For fraction  0.531
  // Exponents:  0  . -1 -2 -3
  // Digits:     0  .  5  3  1
  for (let i = 0; i < strArr.length; i++) {
    decimalFraction = decimalFraction.plus(
      BaseDigits.getValue(strArr[i], radix) * Math.pow(radix, exponent * -1)
    )
    exponent++
  }
  return decimalFraction
}

export function isValidString(str: string, radix: number): boolean {
  if (radix <= 36) {
    let re = new RegExp(getRepresentationRegexPattern(radix))
    return re.test(str)
  }

  if (str[0] === '-') {
    str = str.substr(1)
  }

  let strList = str.replace('.', ' ').split(' ')
  return strList.some(digit => {
    let num = parseInt(digit, 10)
    return !Number.isNaN(num) && num < radix
  })
}

export function isFloatingPointStr(str: string): boolean {
  return str.includes('.')
}

export function getRepresentationRegexPattern(radix: number): string {
  if (radix > 36) {
    throw new Error('Matching characters by regex only supporter for bases 2- 36')
  }
  let pattern = ''
  if (radix <= 10) {
    // All characters that optionally start with -, are between 0 - given number
    // and might have . in between
    pattern = '^-?[0-#]+([.][0-#]+)?$'
    pattern = replaceAll(pattern, '#', BaseDigits.getDigit(radix - 1, radix)[0])
  } else {
    // All characters that optionally start with -, are between 0 - 9 or A - last character of representation
    // and might . in between
    pattern = '^-?[0-9A-#]+([.][0-9A-#]+)?$'
    pattern = replaceAll(pattern, '#', BaseDigits.getDigit(radix - 1, radix)[0])
  }
  return pattern
}

export function toDigitLists(num: BigNumber): [string[], string[]] {
  let int: string[] = []
  let frac: string[] = []
  let digits = num.toString()
  if (num.isNegative()) {
    digits = digits.substring(1)
  }
  if (digits.includes('.')) {
    // Number has non zero fraction part
    frac = digits.split('.')[1].split('')
  }
  int = digits.split('.')[0].split('')
  return [int, frac]
}
