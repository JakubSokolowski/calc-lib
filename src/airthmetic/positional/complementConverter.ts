import { BaseDigits } from './baseDigits'
import { representationStrToStrList } from '../conversionHelpers'

export class BaseComplement {
  valueStr: string
  prefix: string

  constructor(value: string, prefix: string) {
    this.valueStr = value
    this.prefix = prefix
  }

  toString(): string {
    return this.prefix + this.valueStr
  }
}

export class ComplementConverter {
  repDigits = new BaseDigits(10)

  constructor(radix: number = 10) {
    this.repDigits = new BaseDigits(radix)
  }

  static toDigitList(valueStr: string, radix: number): [string[], number] {
    let val = ComplementConverter.removeDelimiter(valueStr, radix)
    let digitList = representationStrToStrList(val[0], radix)
    digitList = digitList.filter(x => {
      return x !== ' '
    })
    return [digitList, val[1]]
  }

  static IsNegative(str: string) {
    return str.charAt(0) === '-'
  }

  static HasDelimiter(str: string): boolean {
    return str.includes('.') || str.includes(',')
  }

  static removeDelimiter(valueStr: string, radix: number): [string, number] {
    valueStr = valueStr.replace(',', '.')
    let delimiterIndex = valueStr.indexOf('.')
    if (delimiterIndex < 0) {
      delimiterIndex = valueStr.length - 1
    }
    if (radix > 36) {
      valueStr = valueStr.replace('.', ' ')
    } else {
      valueStr = valueStr.replace('.', '')
    }
    return [valueStr, delimiterIndex]
  }

  static restoreDelimiter(str: string, radix: number, index: number): string {
    if (radix > 36) {
      str = str.slice(0, index) + str.slice(index + 1)
    }
    str = str.slice(0, index) + '.' + str.slice(index)
    return str
  }

  getComplement(valueStr: string, radix: number): BaseComplement {
    if (ComplementConverter.IsNegative(valueStr)) {
      return this.getNegativeNumberComplement(valueStr, radix)
    } else {
      return this.getPositiveNumberComplement(valueStr, radix)
    }
  }

  getNegativeNumberComplement(valueStr: string, radix: number): BaseComplement {
    this.repDigits.currentRadix = radix
    let prefix = this.getPrefix(valueStr, radix)
    let noSignValue = valueStr.substr(1)
    let suffix = this.getSuffix(valueStr, radix)

    let strArr = ComplementConverter.toDigitList(noSignValue, radix)
    let complement = this.calculateComplement(strArr[0], radix)
    if (!suffix) {
      complement = ComplementConverter.restoreDelimiter(complement, radix, strArr[1])
    }
    return new BaseComplement(complement + suffix, prefix)
  }

  getPositiveNumberComplement(valueStr: string, radix: number): BaseComplement {
    let prefix = this.getPrefix(valueStr, radix)
    let suffix = this.getSuffix(valueStr, radix)
    return new BaseComplement(valueStr + suffix, prefix)
  }

  getSuffix(valueStr: string, radix: number): string {
    this.repDigits.currentRadix = radix
    if (ComplementConverter.HasDelimiter(valueStr)) {
      return ''
    }
    return '.' + this.repDigits.getDigit(0)
  }

  getPrefix(valueStr: string, radix: number): string {
    this.repDigits.currentRadix = radix
    if (ComplementConverter.IsNegative(valueStr)) {
      return '(' + this.repDigits.getDigit(radix - 1) + ')'
    } else {
      return '(' + this.repDigits.getDigit(0) + ')'
    }
  }

  getDigitComplement(digit: string, radix: number): string {
    return this.repDigits.getDigit(radix - 1 - this.repDigits.getValue(digit))
  }

  incrementNumber(digits: string[], radix: number): string {
    this.repDigits.currentRadix = radix
    for (let i = digits.length - 1; i >= 0; i--) {
      let val = this.repDigits.getValue(digits[i])
      if (val === radix - 1) {
        digits[i] = this.repDigits.getDigit(0)
      } else {
        digits[i] = this.repDigits.getDigit(val + 1)
        break
      }
    }
    if (radix > 36) {
      return digits.join(' ')
    } else {
      return digits.join('')
    }
  }

  calculateComplement(digits: string[], radix: number): string {
    for (let i = 0; i < digits.length; i++) {
      digits[i] = this.getDigitComplement(digits[i], radix)
    }
    return this.incrementNumber(digits, radix)
  }
}
