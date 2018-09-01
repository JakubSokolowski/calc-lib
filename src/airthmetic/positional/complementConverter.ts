import { representationStrToStrList } from '../conversionHelpers'
import { BaseDigits } from './baseDigits'

export class BaseComplement {
  public valueStr: string
  public prefix: string

  constructor(value: string, prefix: string) {
    this.valueStr = value
    this.prefix = prefix
  }

  public toString(): string {
    return this.prefix + this.valueStr
  }
}

export class ComplementConverter {
  public static toDigitList(valueStr: string, radix: number): [string[], number] {
    const val = ComplementConverter.removeDelimiter(valueStr, radix)
    let digitList = representationStrToStrList(val[0], radix)
    digitList = digitList.filter(x => {
      return x !== ' '
    })
    return [digitList, val[1]]
  }

  public static IsNegative(str: string) {
    return str.charAt(0) === '-'
  }

  public static HasDelimiter(str: string): boolean {
    return str.includes('.') || str.includes(',')
  }

  public static removeDelimiter(valueStr: string, radix: number): [string, number] {
    valueStr = valueStr.replace(',', '.')
    let delimiterIndex = valueStr.indexOf('.')
    if (delimiterIndex < 0) {
      delimiterIndex = valueStr.length - 1
    }
    valueStr = radix > 36 ? valueStr.replace('.', ' ') : valueStr.replace('.', '')
    return [valueStr, delimiterIndex]
  }

  public static restoreDelimiter(str: string, radix: number, index: number): string {
    if (radix > 36) {
      str = str.slice(0, index) + str.slice(index + 1)
    }
    str = str.slice(0, index) + '.' + str.slice(index)
    return str
  }

  public static getComplement(valueStr: string, radix: number): BaseComplement {
    if (ComplementConverter.IsNegative(valueStr)) {
      return this.getNegativeNumberComplement(valueStr, radix)
    } else {
      return this.getPositiveNumberComplement(valueStr, radix)
    }
  }

  public static getNegativeNumberComplement(valueStr: string, radix: number): BaseComplement {
    const prefix = this.getPrefix(valueStr, radix)
    const noSignValue = valueStr.substr(1)
    const suffix = this.getSuffix(valueStr, radix)

    const strArr = ComplementConverter.toDigitList(noSignValue, radix)
    let complement = ComplementConverter.calculateComplement(strArr[0], radix)
    if (!suffix) {
      complement = ComplementConverter.restoreDelimiter(complement, radix, strArr[1])
    }
    return new BaseComplement(complement + suffix, prefix)
  }

  public static getPositiveNumberComplement(valueStr: string, radix: number): BaseComplement {
    const prefix = this.getPrefix(valueStr, radix)
    const suffix = this.getSuffix(valueStr, radix)
    return new BaseComplement(valueStr + suffix, prefix)
  }

  public static getSuffix(valueStr: string, radix: number): string {
    if (ComplementConverter.HasDelimiter(valueStr)) {
      return ''
    }
    return '.' + BaseDigits.getDigit(0, radix)
  }

  public static getPrefix(valueStr: string, radix: number): string {
    if (ComplementConverter.IsNegative(valueStr)) {
      return '(' + BaseDigits.getDigit(radix - 1, radix) + ')'
    } else {
      return '(' + BaseDigits.getDigit(0, radix) + ')'
    }
  }

  public static getDigitComplement(digit: string, radix: number): string {
    return BaseDigits.getDigit(radix - 1 - BaseDigits.getValue(digit, radix), radix)
  }

  public static incrementNumber(digits: string[], radix: number): string {
    for (let i = digits.length - 1; i >= 0; i--) {
      const val = BaseDigits.getValue(digits[i], radix)
      if (val === radix - 1) {
        digits[i] = BaseDigits.getDigit(0, radix)
      } else {
        digits[i] = BaseDigits.getDigit(val + 1, radix)
        break
      }
    }
    if (radix > 36) {
      return digits.join(' ')
    } else {
      return digits.join('')
    }
  }

  public static calculateComplement(digits: string[], radix: number): string {
    for (let i = 0; i < digits.length; i++) {
      digits[i] = ComplementConverter.getDigitComplement(digits[i], radix)
    }
    return this.incrementNumber(digits, radix)
  }
}
