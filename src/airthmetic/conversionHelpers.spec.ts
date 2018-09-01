import {
  arbitraryFractionToDecimal,
  arbitraryIntegralToDecimal,
  decimalFractionToArbitrary,
  decimalIntegralToArbitrary,
  getRepresentationRegexPattern,
  isFloatingPointStr,
  isValidString,
  prependStr,
  prependZeros,
  removeTrailingZerosAndSpaces,
  removeZeroDigits,
  replaceAll,
  representationStrToStrList,
  toDigitLists
} from './conversionHelpers'
import BigNumber from 'bignumber.js'

describe('removeTrailingZerosAndSpaces tests', () => {
  it('removes trailing zeros and spaces from string', () => {
    let input = '6235123 00 00 0'
    let actual = removeTrailingZerosAndSpaces(input)
    let expected = '6235123'
    expect(actual).toEqual(expected)
  })
  it('removes trailing "." ', () => {
    let input = '6235123.00'
    let actual = removeTrailingZerosAndSpaces(input)
    let expected = '6235123'
    expect(actual).toEqual(expected)
  })
  it('removes trailing "." ', () => {
    let input = '6235123,00'
    let actual = removeTrailingZerosAndSpaces(input)
    let expected = '6235123'
    expect(actual).toEqual(expected)
  })
  it('does not modify string with nothing to remove', () => {
    let input = '6235123'
    let actual = removeTrailingZerosAndSpaces(input)
    let expected = '6235123'
    expect(actual).toEqual(expected)
  })
  it('does not modify empty string', () => {
    let input = ''
    let actual = removeTrailingZerosAndSpaces(input)
    let expected = ''
    expect(actual).toEqual(expected)
  })
})

describe('removeZeroDigits tests', () => {
  it('removes trailing zero digits from single char digit array', () => {
    let input = ['1', '2', '3', '0', '1', '0', '0']
    let actual = removeZeroDigits(input)
    let expected = ['1', '2', '3', '0', '1']
    expect(actual).toEqual(expected)
  })
  it('does not modify string with nothing to remove', () => {
    let input = ['1', '2', '3', '0', '1']
    let actual = removeZeroDigits(input)
    let expected = ['1', '2', '3', '0', '1']
    expect(actual).toEqual(expected)
  })
  it('removes trailing zero digits from double char digit array', () => {
    let input = ['11', '23', '30', '50', '10', '00', '00']
    let actual = removeZeroDigits(input)
    let expected = ['11', '23', '30', '50', '10']
    expect(actual).toEqual(expected)
  })
  it('does not modify string with nothing to remove', () => {
    let input = ['1', '2', '3', '0', '1']
    let actual = removeZeroDigits(input)
    let expected = ['1', '2', '3', '0', '1']
    expect(actual).toEqual(expected)
  })
  it('does not modify empty array', () => {
    let input: string[] = []
    let actual = removeZeroDigits(input)
    let expected: string[] = []
    expect(actual).toEqual(expected)
  })
})

describe('representationStrToStrList tests', () => {
  it('returns valid list for sub 36 radix string', () => {
    let input = '7543'
    let radix = 8
    let actual = representationStrToStrList(input, radix)
    let expected = ['7', '5', '4', '3']
    expect(actual).toEqual(expected)
  })
  it('throws error when radix is to small', () => {
    let input = '12 24 26 76'
    let radix = 64
    let actual = representationStrToStrList(input, radix)
    let expected = ['12', '24', '26', '76']
    expect(actual).toEqual(expected)
  })
})

describe('replaceAll tests', () => {
  it('replaces all characters in string', () => {
    let input = 'A#CA#C'
    let actual = replaceAll(input, '#', 'B')
    let expected = 'ABCABC'
    expect(actual).toEqual(expected)
  })
  it('does not modify string without character to replace', () => {
    let input = 'ACAC'
    let actual = replaceAll(input, '#', 'B')
    let expected = 'ACAC'
    expect(actual).toEqual(expected)
  })
})

describe('prependZeros tests', () => {
  it('prepends zeros to the string until the desired length is reached', () => {
    let input = '1111'
    let desiredLenght = 8
    let actual = prependZeros(input, desiredLenght)
    let expected = '00001111'
    expect(actual).toEqual(expected)
  })
  it('does not modify the string that is longer than desiredLength', () => {
    let input = '1111'
    let desiredLenght = 3
    let actual = prependZeros(input, desiredLenght)
    let expected = '1111'
    expect(actual).toEqual(expected)
  })
})

describe('prependStr tests', () => {
  it('prepends character to the string until the desired length is reached', () => {
    let input = '1111'
    let desiredLenght = 8
    let actual = prependStr('1', input, desiredLenght)
    let expected = '11111111'
    expect(actual).toEqual(expected)
  })
  it('does not modify the string that is longer than desiredLength', () => {
    let input = '1111'
    let desiredLenght = 3
    let actual = prependStr('1', input, desiredLenght)
    let expected = '1111'
    expect(actual).toEqual(expected)
  })
})

describe('getRepresentationRegexPattern test', () => {
  it('returns correct pattern for base binary numbers', () => {
    let radix = 2
    let expected = '^-?[0-1]+([.][0-1]+)?$'
    expect(getRepresentationRegexPattern(radix)).toEqual(expected)
  })
  it('returns correct pattern for base 10 numbers', () => {
    let radix = 10
    let expected = '^-?[0-9]+([.][0-9]+)?$'
    expect(getRepresentationRegexPattern(radix)).toEqual(expected)
  })
  it('returns correct pattern for base 16 numbers', () => {
    let radix = 16
    let expected = '^-?[0-9A-F]+([.][0-9A-F]+)?$'
    expect(getRepresentationRegexPattern(radix)).toEqual(expected)
  })
  it('throws error if radix > 36', () => {
    let radix = 40
    expect(() => {
      getRepresentationRegexPattern(radix)
    }).toThrow()
  })
})

describe('isValidString test', () => {
  it('returns true if string matches the radix', () => {
    let str = 'FFFA.6556A'
    let radix = 16
    expect(isValidString(str, radix)).toBeTruthy()
  })
  it('returns false if string is invalid for radix', () => {
    let str = 'ZZZa asd1  sad'
    let radix = 10
    expect(isValidString(str, radix)).toBeFalsy()
  })
  it('returns false if string does not match the radix', () => {
    let str = 'AABFBAA.FF'
    let radix = 15
    expect(isValidString(str, radix)).toBeFalsy()
  })
  it('returns true if string matches the radix for base > 36', () => {
    let str = '-01 36 56.92 34'
    let radix = 64
    expect(isValidString(str, radix)).toBeTruthy()
  })
  it('returns false if string does not match the radix for base > 36', () => {
    let str = '01 78'
    let radix = 64
    expect(isValidString(str, radix)).toBeTruthy()
  })

  it('returns false if the string has multiple signs', () => {
    let str = '--1234.-230'
    let radix = 10
    expect(isValidString(str, radix)).toBeFalsy()
  })
  it('returns false if the string has multiple delimiters', () => {
    let str = '1234..230'
    let radix = 10
    expect(isValidString(str, radix)).toBeFalsy()
  })
})

describe('decimalIntegralToArbitrary tests', () => {
  it('returns correct pattern for 0 in base 2', () => {
    let input = new BigNumber(0)
    let radix = 2
    let expected = '0'.split('')
    let expectedDivisors: string[] = []
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
  it('returns correct pattern for 25 in base 2', () => {
    let input = new BigNumber(25)
    let radix = 2
    let expected = '11001'.split('')
    let expectedDivisors: string[] = ['25', '12', '6', '3', '1']
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
  it('returns correct pattern for -25 in base 2', () => {
    let input = new BigNumber(-25)
    let radix = 2
    let expected = '11001'.split('')
    let expectedDivisors: string[] = ['25', '12', '6', '3', '1']
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
  it('returns correct pattern for 255 in base 16', () => {
    let input = new BigNumber(255)
    let radix = 16
    let expected = 'FF'.split('')
    let expectedDivisors: string[] = ['255', '15']
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
  it('returns correct pattern for -255 in base 16', () => {
    let input = new BigNumber(-255)
    let radix = 16
    let expected = 'FF'.split('')
    let expectedDivisors = ['255', '15']
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
  it('returns correct pattern for 100 in base 64', () => {
    let input = new BigNumber(100)
    let radix = 64
    let expected = '01 36'.split(' ')
    let expectedDivisors = ['100', '1']
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
  it('returns correct pattern for -100 in base 64', () => {
    let input = new BigNumber(-100)
    let radix = 64
    let expected = '01 36'.split(' ')
    let expectedDivisors = ['100', '1']
    let result = decimalIntegralToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedDivisors)
  })
})

describe('arbitraryIntegralToDecimal tests', () => {
  it('converts 0 in base 2 to base 10', () => {
    let input = '0'
    let radix = 2
    let expected = new BigNumber(0)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts positive number in base 2 to base 10', () => {
    let input = '11001'
    let radix = 2
    let expected = new BigNumber(25)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts negative number in base 2 to base 10', () => {
    let input = '-11001'
    let radix = 2
    let expected = new BigNumber(-25)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts positive number in base 16 to base 10', () => {
    let input = 'FF'
    let radix = 16
    let expected = new BigNumber(255)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts negative number in base 16 to base 10', () => {
    let input = '-FF'
    let radix = 16
    let expected = new BigNumber(-255)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts positive number in base 64 to base 10', () => {
    let input = '01 36'
    let radix = 64
    let expected = new BigNumber(100)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts negative number in base 64 to base 10', () => {
    let input = '-01 36'
    let radix = 64
    let expected = new BigNumber(-100)
    expect(arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('throws error if valueStr does match input radix', () => {
    let input = 'FF8'
    let inputRadix = 10
    expect(() => {
      arbitraryIntegralToDecimal(input, inputRadix)
    }).toThrow()
  })
})

describe('decimalFractionToArbitrary tests', () => {
  it('converts 0 fraction to zero digit', () => {
    let input = new BigNumber(0)
    let radix = 2
    let expected = '0'.split('')
    let expectedFractions: string[] = []
    let result = decimalFractionToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
  it('converts decimal fraction to exact binary', () => {
    let input = new BigNumber(0.75)
    let radix = 2
    let expected = '11'.split('')
    let expectedFractions: string[] = ['0.75', '0.5']
    let result = decimalFractionToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
  it('converts decimal fraction to base 2 with 30 digits precision', () => {
    let input = new BigNumber(0.3)
    let radix = 2
    let expected = '010011001100110011001100110011'.split('')
    let expectedFractions: string[] = [
      '0.3',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6',
      '0.2',
      '0.4',
      '0.8',
      '0.6'
    ]
    let result = decimalFractionToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
  it('converts decimal fraction to exact base 16', () => {
    let input = new BigNumber(0.5)
    let radix = 16
    let expected = '8'.split('')
    let expectedFractions: string[] = ['0.5']
    let result = decimalFractionToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
  it('converts decimal fraction to base 16 with 30 digits precision', () => {
    let input = new BigNumber(0.3)
    let radix = 16
    let expected = '4CCCCCCCCCCCCCCCCCCCCCCCCCCCCC'.split('')
    let expectedFractions: string[] = [
      '0.3',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8',
      '0.8'
    ]
    let result = decimalFractionToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
  it('converts decimal fraction to exact base 64', () => {
    let input = new BigNumber(0.5)
    let radix = 64
    let expected = '32'.split(' ')
    let expectedFractions: string[] = ['0.5']
    let result = decimalFractionToArbitrary(input, radix)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
  it('converts decimal fraction to base 64 with 15 digits precision', () => {
    let input = new BigNumber(0.3)
    let radix = 64
    let expected = '19 12 51 12 51 12 51 12 51 12 51 12 51 12 51'.split(' ')
    let expectedFractions: string[] = [
      '0.3',
      '0.2',
      '0.8',
      '0.2',
      '0.8',
      '0.2',
      '0.8',
      '0.2',
      '0.8',
      '0.2',
      '0.8',
      '0.2',
      '0.8',
      '0.2',
      '0.8'
    ]
    let result = decimalFractionToArbitrary(input, radix, 15)
    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(expectedFractions)
  })
})

describe('arbitraryFractionToDecimal tests', () => {
  it('converts base 2 fraction to exact decimal', () => {
    let input = '11'
    let radix = 2
    let expected = new BigNumber(0.75)
    expect(arbitraryFractionToDecimal(input, radix)).toEqual(expected)
  })
  it('converts base 2 fraction to exact decimal without rounding', () => {
    let input = '010011001100110011001100110011'
    let radix = 2
    let expected = '0.2999999998137354850769035'
    expect(arbitraryFractionToDecimal(input, radix).toString()).toEqual(expected)
  })
  it('converts base 2 fraction to exact decimal with rounding', () => {
    let input = '010011001100110011001100110011'
    let radix = 2
    let expected = '0.3'
    expect(
      arbitraryFractionToDecimal(input, radix)
        .toPrecision(1)
        .toString()
    ).toEqual(expected)
  })
})

describe('isFloatingPointStr tests', () => {
  it('returns true if string has delimiter', () => {
    let input = '1.1'
    expect(isFloatingPointStr(input)).toBeTruthy()
  })
  it('returns false if string has no delimiter', () => {
    let input = '1121'
    expect(isFloatingPointStr(input)).toBeFalsy()
  })
})

describe('toDigitsLists test', () => {
  it('Converts float number to lists of integer and fraction part digits', () => {
    let num = new BigNumber(25.5)
    let expectedIntegral = ['2', '5']
    let expectedFractional = ['5']
    let result = toDigitLists(num)
    expect(result[0]).toEqual(expectedIntegral)
    expect(result[1]).toEqual(expectedFractional)
  })
  it('Converts int number to lists of integer and fraction part digits', () => {
    let num = new BigNumber(25)
    let expectedIntegral = ['2', '5']
    let expectedFractional: string[] = []
    let result = toDigitLists(num)
    expect(result[0]).toEqual(expectedIntegral)
    expect(result[1]).toEqual(expectedFractional)
  })
  it('Converts negative int number to lists of integer and fraction part digits', () => {
    let num = new BigNumber(-25)
    let expectedIntegral = ['2', '5']
    let expectedFractional: string[] = []
    let result = toDigitLists(num)
    expect(result[0]).toEqual(expectedIntegral)
    expect(result[1]).toEqual(expectedFractional)
  })
})
