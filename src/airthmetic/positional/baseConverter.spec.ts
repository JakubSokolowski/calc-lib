import BigNumber from 'bignumber.js'
import { StandardBaseConverter } from './baseConverter'

describe('StandardBaseConverter fromNumber tests', () => {
  let BaseConverter = new StandardBaseConverter()

  it('converts positive floating base 10 to base 2', () => {
    let input = new BigNumber(25.5)
    let radix = 2
    let expected = '11001.1'
    let expectedComplement = '(0)11001.1'
    let result = BaseConverter.fromNumber(input, radix).result
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative floating base 10 to base 2', () => {
    let input = new BigNumber(-25.5)
    let radix = 2
    let expected = '-11001.1'
    let expectedComplement = '(1)00110.1'
    let result = BaseConverter.fromNumber(input, radix).result
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive base 10 to base 16', () => {
    let input = new BigNumber(255)
    let radix = 16
    let expected = 'FF.0'
    let expectedComplement = '(0)FF.0'
    let result = BaseConverter.fromNumber(input, radix).result
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 10 to base 16', () => {
    let input = new BigNumber(255.5)
    let radix = 16
    let expected = 'FF.8'
    let expectedComplement = '(0)FF.8'
    let result = BaseConverter.fromNumber(input, radix).result
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 10 to base 2 from number', () => {
    let input = 25.5
    let radix = 2
    let expected = '11001.1'
    let expectedComplement = '(0)11001.1'
    let result = BaseConverter.fromNumber(input, radix).result
    expect(result.valueInBase).toEqual(expected)
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
})
describe('StandardBaseConverter fromString tests', () => {
  let BaseConverter = new StandardBaseConverter()
  it('converts positive base 2 integer to base 10', () => {
    let input = '11001'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(25)
    let expectedComplement = '(0)25.0'
    let result = BaseConverter.fromString(input, inputRadix, outputRadix).result
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative base 2 integer to base 10', () => {
    let input = '-11001'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(-25)
    let expectedComplement = '(9)75.0'
    let result = BaseConverter.fromString(input, inputRadix, outputRadix).result
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 2 to base 10', () => {
    let input = '11001.1'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(25.5)
    let expectedComplement = '(0)25.5'
    let result = BaseConverter.fromString(input, inputRadix, outputRadix).result
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative floating base 2 to base 10', () => {
    let input = '-11001.1'
    let inputRadix = 2
    let outputRadix = 10
    let expected = new BigNumber(-25.5)
    let expectedComplement = '(9)74.5'
    let result = BaseConverter.fromString(input, inputRadix, outputRadix).result
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 16 to base 10', () => {
    let input = 'FF.8'
    let inputRadix = 16
    let outputRadix = 10
    let expected = new BigNumber(255.5)
    let expectedComplement = '(0)255.5'
    let result = BaseConverter.fromString(input, inputRadix, outputRadix).result
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts negative floating base 16 to base 10', () => {
    let input = '-FF.8'
    let inputRadix = 16
    let outputRadix = 10
    let expected = new BigNumber(-255.5)
    let expectedComplement = '(9)744.5'
    let result = BaseConverter.fromString(input, inputRadix, outputRadix).result
    expect(result.valueInBase).toEqual(expected.toString())
    expect(result.complement.toString()).toEqual(expectedComplement)
  })
  it('converts positive floating base 2 to base 8', () => {
    let input = '11001.1'
    let inputRadix = 2
    let outputRadix = 8
    let expected = new BigNumber(25.5)
    let expectedValueStr = '31.4'
    let conv = BaseConverter.fromString(input, inputRadix, outputRadix)
    let result = conv.result
    expect(result.valueInDecimal).toEqual(expected)
    expect(result.radix).toEqual(outputRadix)
    expect(result.valueInBase).toEqual(expectedValueStr)
  })
  it('throws error if valueStr does match input radix', () => {
    let input = '-FF8.923'
    let inputRadix = 10
    let outputRadix = 16
    expect(() => {
      BaseConverter.fromString(input, inputRadix, outputRadix)
    }).toThrow()
  })
})
