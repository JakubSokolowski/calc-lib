import { BaseDigits } from './baseDigits'

describe('Constructor test', () => {
  it('throws error when radix is to high', () => {
    expect(function() {
      let bd = new BaseDigits(100)
    }).toThrow()
  })
  it('throws error when radix is to small', () => {
    expect(function() {
      let bd = new BaseDigits(1)
    }).toThrow()
  })
})

describe('GetDigit sub 36 radix test', () => {
  it('returns proper digit for value 10 in hexadecimal', () => {
    let bd = new BaseDigits(16)
    expect(bd.getDigit(10)).toBe('A')
  })
  it('throws error, if requested digit is greater than radix', () => {
    let bd = new BaseDigits(10)
    expect(function() {
      let digit = bd.getDigit(16)
    }).toThrow()
  })
})

describe('GetDigit above 36 radix test', () => {
  it('returns proper digit for value 10 in base 64', () => {
    let bd = new BaseDigits(64)
    expect(bd.getDigit(10)).toBe('10')
  })
  it('adds zero before sub-10 digits in base 64', () => {
    let bd = new BaseDigits(64)
    expect(bd.getDigit(8)).toBe('08')
  })
  it('returns proper digit for value 63 in base 64', () => {
    let bd = new BaseDigits(64)
    expect(bd.getDigit(63)).toBe('63')
  })
  it('throws error, if requested digit is equal to radix', () => {
    let bd = new BaseDigits(64)
    expect(function() {
      let digit = bd.getDigit(64)
    }).toThrow()
  })
  it('throws error, if requested digit is greater than radix', () => {
    let bd = new BaseDigits(64)
    expect(function() {
      let digit = bd.getDigit(65)
    }).toThrow()
  })
  it('returns proper digits after radix change from 10 to 64', () => {
    let bd = new BaseDigits(10)
    expect(bd.getDigit(9)).toBe('9')
    bd.currentRadix = 64
    expect(bd.getDigit(63)).toBe('63')
  })
})

describe('GetDigit tests', () => {
  it('returns proper value for digit "A" in base 16', () => {
    let bd = new BaseDigits(10)
    expect(bd.getValue('A')).toBe(10)
  })
  it('returns proper value for digit "10" in base 64', () => {
    let bd = new BaseDigits(64)
    expect(bd.getValue('10')).toBe(10)
  })
  it('returns undefined if requested value is not in object', () => {
    let bd = new BaseDigits(10)
    expect(bd.getValue('AAA')).toBe(-1)
  })
  it('returns undefined if requested value is equal to radix (not in object)', () => {
    let bd = new BaseDigits(10)
    expect(bd.getValue('10')).toBe(-1)
  })
})
