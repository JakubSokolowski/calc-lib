import { ComplementConverter } from './complementConverter'

describe('getComplement tests', () => {
  let conv = new ComplementConverter()
  it('returns valid complement for positive number', () => {
    let input = '200'
    let radix = 10
    let expected = '200.0'
    let expectedPrefix = '(0)'
    let actual = conv.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for positive number with 0 floating part', () => {
    let input = '200.0'
    let radix = 10
    let expected = '200.0'
    let expectedPrefix = '(0)'
    let actual = conv.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for positive floating number', () => {
    let input = '200.73'
    let radix = 10
    let expected = '200.73'
    let expectedPrefix = '(0)'
    let actual = conv.getPositiveNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })

  it('returns valid complement for negative number', () => {
    let input = '-200'
    let radix = 10
    let expected = '800.0'
    let expectedPrefix = '(9)'
    let actual = conv.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
  it('returns valid complement for negative number with 0 floating part', () => {
    let input = '-200.0'
    let radix = 10
    let expected = '800.0'
    let expectedPrefix = '(9)'
    let actual = conv.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })

  it('returns valid complement for negative floating number', () => {
    let input = '-200.73'
    let radix = 10
    let expected = '799.27'
    let expectedPrefix = '(9)'
    let actual = conv.getNegativeNumberComplement(input, radix)
    expect(actual.valueStr).toEqual(expected)
    expect(actual.prefix).toEqual(expectedPrefix)
  })
})

describe('removeDelimiter tests', () => {
  let conv = new ComplementConverter()
  it('removes delimiter and returns tuple with string and delimiter index', () => {
    let input = '200.22'
    let radix = 10
    let expectedStr = '20022'
    let expectedIndex = 3
    let actual = conv.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
  it('does not modify string without delimeter', () => {
    let input = '20023'
    let radix = 10
    let expectedStr = '20023'
    let expectedIndex = input.length - 1
    let actual = conv.removeDelimiter(input, radix)
    expect(actual[0]).toEqual(expectedStr)
    expect(actual[1]).toEqual(expectedIndex)
  })
})

describe('restoreDelimiter tests', () => {
  let conv = new ComplementConverter()
  it('restores delimiter at previous index', () => {
    let input = '20022'
    let radix = 10
    let index = 3
    let expectedStr = '200.22'
    let actual = conv.restoreDelimiter(input, radix, index)
    expect(actual).toEqual(expectedStr)
  })
})

describe('toDigitList tests', () => {
  let conv = new ComplementConverter()
  it('splits valueStr into arr and returns tuple with arr and delimeter index', () => {
    let input = '200.22'
    let radix = 10
    let index = 3
    let expectedArr = ['2', '0', '0', '2', '2']
    let actual = conv.toDigitList(input, radix)
    expect(actual[0]).toEqual(expectedArr)
    expect(actual[1]).toEqual(index)
  })
})

describe('isNegative tests', () => {
  let conv = new ComplementConverter()
  it('returns true if valueStr is negative', () => {
    let input = '-200.22'
    expect(conv.IsNegative(input)).toBeTruthy()
  })
  it('returns false if valueStr is positive', () => {
    let input = '200.22'
    expect(conv.IsNegative(input)).toBeFalsy()
  })
})
