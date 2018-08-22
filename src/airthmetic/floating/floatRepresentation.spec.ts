import { DoubleRepresentation, SingleRepresentation } from './floatRepresentation'

describe('SingleRepresentation constructor test', () => {
  it('constructs valid single representation from binary string', () => {
    let input = '01000000010010001111010111000011'
    let rep = new SingleRepresentation(input)
    expect(rep.sign).toEqual('0')
    expect(rep.exponent).toEqual('10000000')
    expect(rep.mantissa).toEqual('10010001111010111000011')
  })
})

describe('SingleRepresentation field encoding tests', () => {
  it('returns correct encodings for exponent and mantissa', () => {
    let input = '01000000010010001111010111000011'
    let rep = new SingleRepresentation(input)
    expect(rep.exponentEncoding).toEqual(128)
    expect(rep.mantissaEncoding).toEqual(4781507)
  })
})

describe('SingleRepresentation field value tests', () => {
  it('returns correct values for exponent and mantissa', () => {
    let input = '01000000010010001111010111000011'
    let rep = new SingleRepresentation(input)
    expect(rep.exponentValue).toEqual(1)
    expect(rep.mantissaValue).toEqual(1.5700000524520874)
  })
})

describe('SingleRepresentation binary str conversion tests', () => {
  it('returns correct values for exponent and mantissa', () => {
    let input = '01000000010010001111010111000011'
    let rep = new SingleRepresentation(input)
    let expectedFixed = '3.14'
    let expectedFixedMaxPrecision = '3.1400001049041748046875'
    expect(rep.value.toFixed(2)).toEqual(expectedFixed)
    expect(rep.value.toFixed(22)).toEqual(expectedFixedMaxPrecision)
  })
})

describe('DoubleRepresentation constructor test', () => {
  it('constructs valid single representation from binary string', () => {
    let input = '0100000000001001000111101011100001010001111010111000010100011111\n'
    let rep = new DoubleRepresentation(input)
    expect(rep.sign).toEqual('0')
    expect(rep.exponent).toEqual('10000000000')
    expect(rep.mantissa).toEqual('1001000111101011100001010001111010111000010100011111')
  })
})

describe('DoubleRepresentation field encoding tests', () => {
  it('returns correct encodings for exponent and mantissa', () => {
    let input = '0100000000001001000111101011100001010001111010111000010100011111'
    let rep = new DoubleRepresentation(input)
    expect(rep.exponentEncoding).toEqual(1024)
    expect(rep.mantissaEncoding).toEqual(2567051787601183)
  })
})

describe('DoubleRepresentation field value tests', () => {
  it('returns correct values for exponent and mantissa', () => {
    let input = '0100000000001001000111101011100001010001111010111000010100011111'
    let rep = new DoubleRepresentation(input)
    expect(rep.exponentValue).toEqual(1)
    expect(rep.mantissaValue).toEqual(1.57)
    expect(rep.mantissaValue.toFixed(52)).toEqual(
      '1.5700000000000000621724893790087662637233734130859375'
    )
  })

  describe('DoubleRepresentation binary str conversion tests', () => {
    it('returns correct values for exponent and mantissa', () => {
      let input = '0100000000001001000111101011100001010001111010111000010100011111'
      let rep = new DoubleRepresentation(input)
      expect(rep.value.toFixed(2)).toEqual('3.14')
      expect(rep.value.toFixed(52)).toEqual(
        '3.1400000000000001243449787580175325274467468261718750'
      )
    })
  })
})
