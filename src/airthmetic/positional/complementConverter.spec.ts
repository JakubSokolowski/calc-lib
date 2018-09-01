import { BaseComplement, ComplementConverter } from './complementConverter'

describe('getPositiveComplement tests', () => {
  it('returns valid complement for positive number', () => {
    const input = '200'
    const radix = 10
    const expected = '200.0'
    const expectedPrefix = '(0)'
    const actual = ComplementConverter.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for positive number with 0 floating part', () => {
    const input = '200.0'
    const radix = 10
    const expected = '200.0'
    const expectedPrefix = '(0)'
    const actual = ComplementConverter.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for positive floating number', () => {
    const input = '200.73'
    const radix = 10
    const expected = '200.73'
    const expectedPrefix = '(0)'
    const actual = ComplementConverter.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('getNegativeComplement tests', () => {
  it('returns valid complement for base 10 negative number', () => {
    const input = '-200'
    const radix = 10
    const expected = '800.0'
    const expectedPrefix = '(9)'
    const actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for base 10 negative number with 0 floating part', () => {
    const input = '-200.0'
    const radix = 10
    const expected = '800.0'
    const expectedPrefix = '(9)'
    const actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })

  it('returns valid complement for base 10 negative floating number', () => {
    const input = '-11001.1'
    const radix = 2
    const expected = '00110.1'
    const expectedPrefix = '(1)'
    const actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for base 2 negative floating number', () => {
    const input = '-200.73'
    const radix = 10
    const expected = '799.27'
    const expectedPrefix = '(9)'
    const actual = ComplementConverter.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('getComplement tests', () => {
  it('returns valid complement for positive number', () => {
    const input = '200'
    const radix = 10
    const expected = '200.0'
    const expectedPrefix = '(0)'
    const actual = ComplementConverter.getComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for negative number', () => {
    const input = '-200'
    const radix = 10
    const expected = '800.0'
    const expectedPrefix = '(9)'
    const actual = ComplementConverter.getComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('removeDelimiter tests', () => {
  it('removes delimiter and returns tuple with string and delimiter index', () => {
    const input = '200.22'
    const radix = 10
    const expectedStr = '20022'
    const expectedIndex = 3
    const actual = ComplementConverter.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
  it('removes delimiter and returns tuple with string and delimiter index when radix > 36', () => {
    const input = '20 32.56'
    const radix = 64
    const expectedStr = '20 32 56'
    const expectedIndex = 5
    const actual = ComplementConverter.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
  it('does not modify string without delimiter', () => {
    const input = '20023'
    const radix = 10
    const expectedStr = '20023'
    const expectedIndex = input.length - 1
    const actual = ComplementConverter.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
})

describe('restoreDelimiter tests', () => {
  it('restores delimiter at previous index', () => {
    const input = '20022'
    const radix = 10
    const index = 3
    const expectedStr = '200.22'
    const actual = ComplementConverter.restoreDelimiter(input, radix, index)
    expect(actual).toEqual(expectedStr)
  })
  it('restores delimiter at previous index when radix > 36', () => {
    const input = '20 32 45 54'
    const radix = 64
    const index = 8
    const expectedStr = '20 32 45.54'
    const actual = ComplementConverter.restoreDelimiter(input, radix, index)
    expect(actual).toEqual(expectedStr)
  })
})

describe('toDigitList tests', () => {
  it('splits valueStr into arr and returns tuple with arr and delimeter index', () => {
    const input = '200.22'
    const radix = 10
    const index = 3
    const expectedArr = ['2', '0', '0', '2', '2']
    const actual = ComplementConverter.toDigitList(input, radix)
    expect(actual[0]).toEqual(expectedArr)
    expect(actual[1]).toEqual(index)
  })
})

describe('isNegative tests', () => {
  it('returns true if valueStr is negative', () => {
    const input = '-200.22'
    expect(ComplementConverter.IsNegative(input)).toBeTruthy()
  })
  it('returns false if valueStr is positive', () => {
    const input = '200.22'
    expect(ComplementConverter.IsNegative(input)).toBeFalsy()
  })
})
describe('incrementNumber tests', () => {
  it('increments number when radix is < 36 and there is no propagation', () => {
    const input = ['7', '8', '9', '2', '3', '4']
    const radix = 10
    const expected = '789235'
    expect(ComplementConverter.incrementNumber(input, radix)).toEqual(expected)
  })
  it('increments number when radix is < 36 and with propagation', () => {
    const input = ['7', '8', '9', '2', '9', '9']
    const radix = 10
    const expected = '789300'
    expect(ComplementConverter.incrementNumber(input, radix)).toEqual(expected)
  })
  it('increments number when radix is > 36 and there is no propagation', () => {
    const input = ['10', '48', '29', '42', '23', '44']
    const radix = 64
    const expected = '10 48 29 42 23 45'
    const actual = ComplementConverter.incrementNumber(input, radix)
    expect(actual).toEqual(expected)
  })
  it('increments number when radix is > 36 and with propagation', () => {
    const input = ['10', '48', '29', '63', '63', '63']
    const radix = 64
    const expected = '10 48 30 00 00 00'
    expect(ComplementConverter.incrementNumber(input, radix)).toEqual(expected)
  })
})

describe('toString tests', () => {
  it('concats value and prefix', () => {
    const value = '100101.11'
    const prefix = '(0)'
    const complement = new BaseComplement(value, prefix)
    expect(complement.toString()).toEqual(prefix + value)
  })
})
