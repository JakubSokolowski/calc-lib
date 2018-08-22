import {
  prependStr,
  prependZeros,
  removeTrailingZerosAndSpaces,
  replaceAll,
  representationStrToStrList
} from './conversionHelpers'

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
    let expected = '11111111'
  })
})
