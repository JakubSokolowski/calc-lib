import { BaseConverter } from './baseConverter'
import BigNumber from 'bignumber.js'

describe('getRepresentationRegexPattern test', () => {
  const conv = new BaseConverter()
  it('returns correct pattern for base binary numbers', () => {
    let radix = 2
    let expected = '^-?[0-1]+([.][0-1]+)?$'
    expect(conv.getRepresentationRegexPattern(radix)).toEqual(expected)
  })
  it('returns correct pattern for base 10 numbers', () => {
    let radix = 10
    let expected = '^-?[0-9]+([.][0-9]+)?$'
    expect(conv.getRepresentationRegexPattern(radix)).toEqual(expected)
  })
  it('returns correct pattern for base 16 numbers', () => {
    let radix = 16
    let expected = '^-?[0-9A-F]+([.][0-9A-F]+)?$'
    expect(conv.getRepresentationRegexPattern(radix)).toEqual(expected)
  })
  it('throws error if radix > 36', () => {
    let radix = 40
    expect(() => {
      conv.getRepresentationRegexPattern(radix)
    }).toThrow()
  })
})

describe('isValidString test', () => {
  const conv = new BaseConverter()
  it('returns true if string matches the radix', () => {
    let str = 'FFFA.6556A'
    let radix = 16
    expect(conv.isValidString(str, radix)).toBeTruthy()
  })
  it('returns false if string is invalid for radix', () => {
    let str = 'ZZZa asd1  sad'
    let radix = 10
    expect(conv.isValidString(str, radix)).toBeFalsy()
  })
  it('returns false if string does not match the radix', () => {
    let str = 'AABFBAA.FF'
    let radix = 15
    expect(conv.isValidString(str, radix)).toBeFalsy()
  })
  it('returns true if string matches the radix for base > 36', () => {
    let str = '-01 36 56.92 34'
    let radix = 64
    expect(conv.isValidString(str, radix)).toBeTruthy()
  })
  it('returns false if string does not match the radix for base > 36', () => {
    let str = '01 78'
    let radix = 64
    expect(conv.isValidString(str, radix)).toBeTruthy()
  })

  it('returns false if the string has multiple signs', () => {
    let str = '--1234.-230'
    let radix = 10
    expect(conv.isValidString(str, radix)).toBeFalsy()
  })
  it('returns false if the string has multiple delimiters', () => {
    let str = '1234..230'
    let radix = 10
    expect(conv.isValidString(str, radix)).toBeFalsy()
  })
})

describe('decimalIntegralToArbitrary tests', () => {
  const conv = new BaseConverter()
  it('returns correct pattern for 0 in base 2', () => {
    let input = new BigNumber(0)
    let radix = 2
    let expected = '0'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
  it('returns correct pattern for 25 in base 2', () => {
    let input = new BigNumber(25)
    let radix = 2
    let expected = '11001'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
  it('returns correct pattern for -25 in base 2', () => {
    let input = new BigNumber(-25)
    let radix = 2
    let expected = '-11001'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
  it('returns correct pattern for 255 in base 16', () => {
    let input = new BigNumber(255)
    let radix = 16
    let expected = 'FF'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
  it('returns correct pattern for -255 in base 16', () => {
    let input = new BigNumber(-255)
    let radix = 16
    let expected = '-FF'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
  it('returns correct pattern for 100 in base 64', () => {
    let input = new BigNumber(100)
    let radix = 64
    let expected = '01 36'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
  it('returns correct pattern for -100 in base 64', () => {
    let input = new BigNumber(-100)
    let radix = 64
    let expected = '-01 36'
    expect(conv.decimalIntegralToArbitrary(input, radix)).toEqual(expected)
  })
})

describe('arbitraryIntegralToDecimal tests', () => {
  const conv = new BaseConverter()
  it('converts 0 in base 2 to base 10', () => {
    let input = '0'
    let radix = 2
    let expected = new BigNumber(0)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts positive number in base 2 to base 10', () => {
    let input = '11001'
    let radix = 2
    let expected = new BigNumber(25)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts negative number in base 2 to base 10', () => {
    let input = '-11001'
    let radix = 2
    let expected = new BigNumber(-25)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts positive number in base 16 to base 10', () => {
    let input = 'FF'
    let radix = 16
    let expected = new BigNumber(255)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts negative number in base 16 to base 10', () => {
    let input = '-FF'
    let radix = 16
    let expected = new BigNumber(-255)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts positive number in base 64 to base 10', () => {
    let input = '01 36'
    let radix = 64
    let expected = new BigNumber(100)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('converts negative number in base 64 to base 10', () => {
    let input = '-01 36'
    let radix = 64
    let expected = new BigNumber(-100)
    expect(conv.arbitraryIntegralToDecimal(input, radix)).toEqual(expected)
  })
  it('throws error if valueStr does match input radix', () => {
    let input = 'FF8'
    let inputRadix = 10
    expect(() => {
      conv.arbitraryIntegralToDecimal(input, inputRadix)
    }).toThrow()
  })
})

describe('decimalFractionToArbitrary tests', () => {
  const conv = new BaseConverter()
  it('converts 0 fraction to zero digit', () => {
    let input = new BigNumber(0)
    let radix = 2
    let expected = '0'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
  it('converts decimal fraction to exact binary', () => {
    let input = new BigNumber(0.75)
    let radix = 2
    let expected = '11'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
  it('converts decimal fraction to base 2 with 30 digits precision', () => {
    let input = new BigNumber(0.3)
    let radix = 2
    let expected = '010011001100110011001100110011'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
  it('converts decimal fraction to exact base 16', () => {
    let input = new BigNumber(0.5)
    let radix = 16
    let expected = '8'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
  it('converts decimal fraction to base 16 with 30 digits precision', () => {
    let input = new BigNumber(0.3)
    let radix = 16
    let expected = '4CCCCCCCCCCCCCCCCCCCCCCCCCCCCC'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
  it('converts decimal fraction to exact base 64', () => {
    let input = new BigNumber(0.5)
    let radix = 64
    let expected = '32'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
  it('converts decimal fraction to base 64 with 15 digits precision', () => {
    conv.formatPrecision = 15
    let input = new BigNumber(0.3)
    let radix = 64
    let expected = '19 12 51 12 51 12 51 12 51 12 51 12 51 12 51'
    expect(conv.decimalFractionToArbitrary(input, radix)).toEqual(expected)
  })
})

describe('arbitraryFractionToDecimal tests', () => {
  const conv = new BaseConverter()
  it('converts base 2 fraction to exact decimal', () => {
    let input = '11'
    let radix = 2
    let expected = new BigNumber(0.75)
    expect(conv.arbitraryFractionToDecimal(input, radix)).toEqual(expected)
  })
  it('converts base 2 fraction to exact decimal without rounding', () => {
    let input = '010011001100110011001100110011'
    let radix = 2
    let expected = '0.2999999998137354850769035'
    expect(conv.arbitraryFractionToDecimal(input, radix).toString()).toEqual(expected)
  })
  it('converts base 2 fraction to exact decimal with rounding', () => {
    let input = '010011001100110011001100110011'
    let radix = 2
    let expected = '0.3'
    expect(
      conv
        .arbitraryFractionToDecimal(input, radix)
        .toPrecision(1)
        .toString()
    ).toEqual(expected)
  })
})

describe('isFloatingPointStr tests', () => {
  const conv = new BaseConverter()
  it('returns true if string has delimiter', () => {
    let input = '1.1'
    expect(conv.isFloatingPointStr(input)).toBeTruthy()
  })
  it('returns false if string has no delimiter', () => {
    let input = '1121'
    expect(conv.isFloatingPointStr(input)).toBeFalsy()
  })
})

describe('fromBigNumber tests', () => {
  const conv = new BaseConverter()
  it('converts positive floating base 10 to base 2', () => {
    let input = new BigNumber(25.5)
    let radix = 2
    let expected = '11001.1'
    let expectedComplement = '(0)11001.1'
    let result = conv.fromBigNumber(input, radix)
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative floating base 10 to base 2', () => {
    let input = new BigNumber(-25.5)
    let radix = 2
    let expected = '-11001.1'
    let expectedComplement = '(1)00110.1'
    let result = conv.fromBigNumber(input, radix)
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive base 10 to base 16', () => {
    let input = new BigNumber(255)
    let radix = 16
    let expected = 'FF.0'
    let expectedComplement = '(0)FF.0'
    let result = conv.fromBigNumber(input, radix)
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 10 to base 16', () => {
    let input = new BigNumber(255.5)
    let radix = 16
    let expected = 'FF.8'
    let expectedComplement = '(0)FF.8'
    let result = conv.fromBigNumber(input, radix)
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
})

describe('fromValueString tests', () => {
  const conv = new BaseConverter()
  it('converts positive base 2 integer to base 10', () => {
    let input = '11001'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(25)
    let expectedComplement = '(0)25.0'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative base 2 integer to base 10', () => {
    let input = '-11001'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(-25)
    let expectedComplement = '(9)75.0'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 2 to base 10', () => {
    let input = '11001.1'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(25.5)
    let expectedComplement = '(0)25.5'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative floating base 2 to base 10', () => {
    let input = '-11001.1'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(-25.5)
    let expectedComplement = '(9)74.5'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 16 to base 10', () => {
    let input = 'FF.8'
    let inputRadix = 16
    let outputRadix = 10
    let expected = new BigNumber(255.5)
    let expectedComplement = '(0)255.5'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative floating base 16 to base 10', () => {
    let input = '-FF.8'
    let inputRadix = 16
    let outputRadix = 10
    let expected = new BigNumber(-255.5)
    let expectedComplement = '(9)744.5'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 2 to base 8', () => {
    let input = '11001.1'
    let inputRadix = 2
    let outputRadix = 8
    let expected = new BigNumber(25.5)
    let expectedValueStr = '31.4'
    let result = conv.fromValueString(input, inputRadix, outputRadix)
    expect(result.valueInDecimal).toEqual(expected)
    expect(result.valueInBase).toEqual(expectedValueStr)
  })
  it('throws error if valueStr does match input radix', () => {
    let input = '-FF8.923'
    let inputRadix = 10
    let outputRadix = 16
    expect(() => {
      conv.fromValueString(input, inputRadix, outputRadix)
    }).toThrow()
  })
})
