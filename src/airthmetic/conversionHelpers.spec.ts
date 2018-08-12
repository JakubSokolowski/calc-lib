import { removeTrailingZerosAndSpaces, representationStrToStrList } from './conversionHelpers'

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
