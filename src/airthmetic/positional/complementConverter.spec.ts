import { ComplementConverter, BaseComplement } from './complementConverter'

describe('getPositiveComplement tests', () => {
  it('returns valid complement for positive number', () => {
    let input = '200'
    let radix = 10
    let expected = '200.0'
    let expectedPrefix = '(0)'
    let actual = ComplementConverter.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for positive number with 0 floating part', () => {
    let input = '200.0'
    let radix = 10
    let expected = '200.0'
    let expectedPrefix = '(0)'
    let actual = ComplementConverter.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for positive floating number', () => {
    let input = '200.73'
    let radix = 10
    let expected = '200.73'
    let expectedPrefix = '(0)'
    let actual = ComplementConverter.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('getNegativeComplement tests', () => {
  it('returns valid complement for base 10 negative number', () => {
    let input = '-200'
    let radix = 10
    let expected = '800.0'
    let expectedPrefix = '(9)'
    let actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for base 10 negative number with 0 floating part', () => {
    let input = '-200.0'
    let radix = 10
    let expected = '800.0'
    let expectedPrefix = '(9)'
    let actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })

  it('returns valid complement for base 10 negative floating number', () => {
    let input = '-11001.1'
    let radix = 2
    let expected = '00110.1'
    let expectedPrefix = '(1)'
    let actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for base 2 negative floating number', () => {
    let input = '-200.73'
    let radix = 10
    let expected = '799.27'
    let expectedPrefix = '(9)'
    let actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('getComplement tests', () => {
  it('returns valid complement for positive number', () => {
    let input = '200'
    let radix = 10
    let expected = '200.0'
    let expectedPrefix = '(0)'
    let actual = ComplementConverter.getComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for negative number', () => {
    let input = '-200'
    let radix = 10
    let expected = '800.0'
    let expectedPrefix = '(9)'
    let actual = ComplementConverter.getComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('removeDelimiter tests', () => {
  it('removes delimiter and returns tuple with string and delimiter index', () => {
    let input = '200.22'
    let radix = 10
    let expectedStr = '20022'
    let expectedIndex = 3
    let actual = ComplementConverter.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
  it('removes delimiter and returns tuple with string and delimiter index when radix > 36', () => {
    let input = '20 32.56'
    let radix = 64
    let expectedStr = '20 32 56'
    let expectedIndex = 5
    let actual = ComplementConverter.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
  it('does not modify string without delimiter', () => {
    let input = '20023'
    let radix = 10
    let expectedStr = '20023'
    let expectedIndex = input.length - 1
    let actual = ComplementConverter.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
})

describe('restoreDelimiter tests', () => {
  it('restores delimiter at previous index', () => {
    let input = '20022'
    let radix = 10
    let index = 3
    let expectedStr = '200.22'
    let actual = ComplementConverter.restoreDelimiter(input, radix, index)
    expect(actual).toEqual(expectedStr)
  })
  it('restores delimiter at previous index when radix > 36', () => {
    let input = '20 32 45 54'
    let radix = 64
    let index = 8
    let expectedStr = '20 32 45.54'
    let actual = ComplementConverter.restoreDelimiter(input, radix, index)
    expect(actual).toEqual(expectedStr)
  })
})

describe('toDigitList tests', () => {
  it('splits valueStr into arr and returns tuple with arr and delimeter index', () => {
    let input = '200.22'
    let radix = 10
    let index = 3
    let expectedArr = ['2', '0', '0', '2', '2']
    let actual = ComplementConverter.toDigitList(input, radix)
    expect(actual[0]).toEqual(expectedArr)
    expect(actual[1]).toEqual(index)
  })
})

describe('isNegative tests', () => {
  it('returns true if valueStr is negative', () => {
    let input = '-200.22'
    expect(ComplementConverter.IsNegative(input)).toBeTruthy()
  })
  it('returns false if valueStr is positive', () => {
    let input = '200.22'
    expect(ComplementConverter.IsNegative(input)).toBeFalsy()
  })
})
describe('incrementNumber tests', () => {
  it('increments number when radix is < 36 and there is no propagation', () => {
    let input = ['7', '8', '9', '2', '3', '4']
    let radix = 10
    let expected = '789235'
    expect(ComplementConverter.incrementNumber(input, radix)).toEqual(expected)
  })
  it('increments number when radix is < 36 and with propagation', () => {
    let input = ['7', '8', '9', '2', '9', '9']
    let radix = 10
    let expected = '789300'
    expect(ComplementConverter.incrementNumber(input, radix)).toEqual(expected)
  })
  it('increments number when radix is > 36 and there is no propagation', () => {
    let input = ['10', '48', '29', '42', '23', '44']
    let radix = 64
    let expected = '10 48 29 42 23 45'
    let actual = ComplementConverter.incrementNumber(input, radix)
    expect(actual).toEqual(expected)
  })
  it('increments number when radix is > 36 and with propagation', () => {
    let input = ['10', '48', '29', '63', '63', '63']
    let radix = 64
    let expected = '10 48 30 00 00 00'
    expect(ComplementConverter.incrementNumber(input, radix)).toEqual(expected)
  })
})

describe('toString tests', () => {
  it('concats value and prefix', () => {
    let value = '100101.11'
    let prefix = '(0)'
    let complement = new BaseComplement(value, prefix)
    expect(complement.toString()).toEqual(prefix + value)
  })
})
