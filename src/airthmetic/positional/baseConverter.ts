import BigNumber from 'bignumber.js'
import { BaseDigits } from './baseDigits'
import {
  removeTrailingZerosAndSpaces,
  replaceAll,
  representationStrToStrList
} from '../conversionHelpers'
import { ComplementConverter, BaseComplement } from './complementConverter'

export class BaseRepresentation {
  radix: number = 10
  valueInDecimal: BigNumber
  valueInBase: string
  complement: BaseComplement

  constructor(
    radix: number,
    valInDecimal: BigNumber,
    valInBase: string,
    complement: BaseComplement
  ) {
    this.radix = radix
    this.valueInDecimal = valInDecimal
    this.valueInBase = valInBase
    this.complement = complement
  }
}

export class BaseConverter {
  static fromBigNumber(num: BigNumber, resultBase: number, precision = 30): BaseRepresentation {
    let fractionVal = num.mod(1)
    let integerVal = num.minus(fractionVal)
    let fractionStr = BaseConverter.decimalFractionToArbitrary(fractionVal, resultBase, precision)
    let integerStr = BaseConverter.decimalIntegralToArbitrary(integerVal, resultBase)
    let result = integerStr + '.' + fractionStr
    let complement = ComplementConverter.getComplement(result, resultBase)
    return new BaseRepresentation(resultBase, num, result, complement)
  }

  static fromBaseRepresentation(
    num: BaseRepresentation,
    resultBase: number,
    precision = 30
  ): BaseRepresentation {
    return BaseConverter.fromBigNumber(num.valueInDecimal, resultBase, precision)
  }

  static fromValueString(
    valueStr: string,
    inputBase: number,
    resultBase: number
  ): BaseRepresentation {
    if (BaseConverter.isValidString(valueStr, inputBase)) {
      let decimalValue = new BigNumber(0)
      if (BaseConverter.isFloatingPointStr(valueStr)) {
        let valueParts = valueStr.split('.')
        let integerPart = BaseConverter.arbitraryIntegralToDecimal(valueParts[0], inputBase)
        let fractionalPart = BaseConverter.arbitraryFractionToDecimal(valueParts[1], inputBase)
        // Make the fractionalPart negative if the integer part is also negative
        // This is needed when both parts are added together to create whole value
        if (integerPart.isNegative()) {
          fractionalPart = fractionalPart.negated()
        }
        decimalValue = integerPart.plus(fractionalPart)
      } else {
        decimalValue = BaseConverter.arbitraryIntegralToDecimal(valueStr, inputBase)
      }
      let complement = ComplementConverter.getComplement(decimalValue.toString(), resultBase)
      let inputInDecimal = new BaseRepresentation(
        10,
        decimalValue,
        decimalValue.toString(),
        complement
      )
      if (resultBase === 10) {
        return inputInDecimal
      }
      return BaseConverter.fromBaseRepresentation(inputInDecimal, resultBase)
    } else {
      throw new Error('The string does not match the radix')
    }
  }

  static arbitraryIntegralToDecimal(valStr: string, radix: number): BigNumber {
    if (BaseConverter.isValidString(valStr, radix)) {
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

  static decimalIntegralToArbitrary(num: BigNumber, radix: number): string {
    if (num.isZero()) {
      return BaseDigits.getDigit(0, radix)
    }
    let result = ''
    let currentNum = num.abs()
    while (!currentNum.isZero()) {
      let remainder = currentNum.mod(radix)
      if (radix > 36) {
        // Reverse the each digit before adding. It's needed for bases higher than 36
        // The digits at positions are calculated from the smallest to biggest position
        // and the order in number is from biggest to smallest, so after appending all positions
        // whole number string must be reversed. That creates problem for bases, where the digits
        // contain 2 characters. For example, let's say that the result of conversion to base 64 is 04 15 06.
        // The number will be later reversed - 60 51 40, but we need to reverse digits, not
        // all the characters - the right result would be 06 15 04. If we reverse each digit first in 04 15 06,
        // before the final reverse we will have 40 51 60, and after we will have proper result 06 15 04
        result = result.concat(
          BaseDigits.getDigit(remainder.toNumber(), radix)
            .split('')
            .reverse()
            .join('')
        )
        result = result.concat(' ')
      } else {
        result = result.concat(BaseDigits.getDigit(remainder.toNumber(), radix))
      }
      currentNum = currentNum.dividedToIntegerBy(radix)
    }
    result = result
      .split('')
      .reverse()
      .join('')
    if (radix > 36) {
      result = result.substr(1)
    }
    if (num.isNegative()) {
      result = '-' + result
    }
    return result
  }

  static decimalFractionToArbitrary(fraction: BigNumber, radix: number, precision = 30): string {
    if (fraction.isZero()) {
      return BaseDigits.getDigit(0, radix)
    }
    if (fraction.isNegative()) {
      fraction = fraction.negated()
    }
    let result = ''
    let num = new BigNumber(0)
    let fractionPart: BigNumber
    let wholePart = 0
    fractionPart = fraction
    for (let i = 0; i < precision; i++) {
      num = fractionPart.multipliedBy(radix)
      fractionPart = num.mod(1)
      wholePart = num.minus(fractionPart).toNumber()
      result = result.concat(BaseDigits.getDigit(wholePart, radix))
      if (radix > 36) {
        result = result.concat(' ')
      }
    }
    return removeTrailingZerosAndSpaces(result)
  }

  static arbitraryFractionToDecimal(fractionStr: string, radix: number): BigNumber {
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

  static isValidString(str: string, radix: number): boolean {
    if (radix <= 36) {
      let re = new RegExp(BaseConverter.getRepresentationRegexPattern(radix))
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

  static isFloatingPointStr(str: string): boolean {
    return str.includes('.')
  }

  static getRepresentationRegexPattern(radix: number): string {
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
}
