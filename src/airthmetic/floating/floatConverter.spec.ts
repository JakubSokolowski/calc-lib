import {
  DoubleRepresentation,
  FloatConverter,
  FloatProperty,
  SingleRepresentation
} from './floatConverter'

describe('SingleRepresentation constructor test', () => {
  it('constructs valid single representation from binary string', () => {
    const input = '01000000010010001111010111000011'
    const rep = new SingleRepresentation(input)
    expect(rep.sign).toEqual('0')
    expect(rep.exponent).toEqual('10000000')
    expect(rep.mantissa).toEqual('10010001111010111000011')
  })
})
describe('SingleRepresentation field encoding tests', () => {
  it('returns correct encodings for exponent and mantissa', () => {
    const input = '01000000010010001111010111000011'
    const rep = new SingleRepresentation(input)
    expect(rep.exponentEncoding).toEqual(128)
    expect(rep.mantissaEncoding).toEqual(4781507)
  })
})
describe('SingleRepresentation field value tests', () => {
  it('returns correct values for exponent and mantissa', () => {
    const input = '01000000010010001111010111000011'
    const rep = new SingleRepresentation(input)
    expect(rep.exponentValue).toEqual(1)
    expect(rep.mantissaValue).toEqual(1.5700000524520874)
  })
})
describe('SingleRepresentation binary str conversion tests', () => {
  it('returns correct values for exponent and mantissa', () => {
    const input = '01000000010010001111010111000011'
    const rep = new SingleRepresentation(input)
    const expectedFixed = '3.14'
    const expectedFixedMaxPrecision = '3.1400001049041748046875'
    expect(rep.value.toFixed(2)).toEqual(expectedFixed)
    expect(rep.value.toFixed(22)).toEqual(expectedFixedMaxPrecision)
  })
})
describe('DoubleRepresentation constructor test', () => {
  it('constructs valid single representation from binary string', () => {
    const input = '0100000000001001000111101011100001010001111010111000010100011111\n'
    const rep = new DoubleRepresentation(input)
    expect(rep.sign).toEqual('0')
    expect(rep.exponent).toEqual('10000000000')
    expect(rep.mantissa).toEqual('1001000111101011100001010001111010111000010100011111')
  })
})
describe('DoubleRepresentation field encoding tests', () => {
  it('returns correct encodings for exponent and mantissa', () => {
    const input = '0100000000001001000111101011100001010001111010111000010100011111'
    const rep = new DoubleRepresentation(input)
    expect(rep.exponentEncoding).toEqual(1024)
    expect(rep.mantissaEncoding).toEqual(2567051787601183)
  })
})
describe('DoubleRepresentation field value tests', () => {
  it('returns correct values for exponent and mantissa', () => {
    const input = '0100000000001001000111101011100001010001111010111000010100011111'
    const rep = new DoubleRepresentation(input)
    expect(rep.exponentValue).toEqual(1)
    expect(rep.mantissaValue).toEqual(1.57)
    expect(rep.mantissaValue.toFixed(52)).toEqual(
      '1.5700000000000000621724893790087662637233734130859375'
    )
  })

  describe('DoubleRepresentation binary str conversion tests', () => {
    it('returns correct values for exponent and mantissa', () => {
      const input = '0100000000001001000111101011100001010001111010111000010100011111'
      const rep = new DoubleRepresentation(input)
      expect(rep.value.toFixed(2)).toEqual('3.14')
      expect(rep.value.toFixed(52)).toEqual(
        '3.1400000000000001243449787580175325274467468261718750'
      )
    })
  })
})

describe('ToSingle tests', () => {
  it('returns representation that matches binary string', () => {
    const input = '01000000010010001111010111000011'
    const rep = FloatConverter.ToSingle(input)
    const expected = '3.14'
    expect(rep.value.toFixed(2)).toEqual(expected)
  })
})
describe('ToDouble tests', () => {
  it('returns representation that matches binary string', () => {
    const input = '0100000000001001000111101011100001010001111010111000010100011111'
    const rep = FloatConverter.ToDouble(input)
    const expected = '3.14'
    expect(rep.value.toFixed(2)).toEqual(expected)
  })
})
describe('SingleToBinaryString tests', () => {
  it('returns binary string that matches positive number', () => {
    const input = 3.14
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '01000000010010001111010111000011'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches negative number', () => {
    const input = -3.14
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '11000000010010001111010111000011'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches small positive number', () => {
    const input = 0.0017
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '00111010110111101101001010001001'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches small negative number', () => {
    const input = -0.0017
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '10111010110111101101001010001001'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches positive zero', () => {
    const input = 0.0
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '00000000000000000000000000000000'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches negative zero', () => {
    const input = -0.0
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '10000000000000000000000000000000'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches positive infinity', () => {
    const input = Number.POSITIVE_INFINITY
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '01111111100000000000000000000000'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches negative infinity', () => {
    const input = Number.NEGATIVE_INFINITY
    const str = FloatConverter.SingleToBinaryString(input)
    const expected = '11111111100000000000000000000000'
    expect(str).toEqual(expected)
  })
})
describe('DoubleToBinaryString tests', () => {
  it('returns binary string that matches positive number', () => {
    const input = 3.14
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '0100000000001001000111101011100001010001111010111000010100011111'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches negative number', () => {
    const input = -3.14
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '1100000000001001000111101011100001010001111010111000010100011111'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches small positive number', () => {
    const input = 0.0017
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '0011111101011011110110100101000100011001110011100000011101011111'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches small negative number', () => {
    const input = -0.0017
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '1011111101011011110110100101000100011001110011100000011101011111'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches positive zero', () => {
    const input = 0.0
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '0000000000000000000000000000000000000000000000000000000000000000'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches negative zero', () => {
    const input = -0.0
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '1000000000000000000000000000000000000000000000000000000000000000'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches positive infinity', () => {
    const input = Number.POSITIVE_INFINITY
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '0111111111110000000000000000000000000000000000000000000000000000'
    expect(str).toEqual(expected)
  })
  it('returns binary string that matches negative infinity', () => {
    const input = Number.NEGATIVE_INFINITY
    const str = FloatConverter.DoubleToBinaryString(input)
    const expected = '1111111111110000000000000000000000000000000000000000000000000000'
    expect(str).toEqual(expected)
  })
})
describe('isPositiveZero tests', () => {
  it('returns true when SingleRepresentation is +0', () => {
    const rep = FloatConverter.ToSingle(0)
    expect(FloatConverter.isPositiveZero(rep)).toBeTruthy()
  })
  it('returns false when SingleRepresentation is not +0', () => {
    const rep = FloatConverter.ToSingle(123)
    expect(FloatConverter.isPositiveZero(rep)).toBeFalsy()
  })
  it('returns true when DoubleRepresentation is +0 ', () => {
    const rep = FloatConverter.ToDouble(0)
    expect(FloatConverter.isPositiveZero(rep)).toBeTruthy()
  })
  it('returns false when DoubleRepresentation is not +0', () => {
    const rep = FloatConverter.ToDouble(123)
    expect(FloatConverter.isPositiveZero(rep)).toBeFalsy()
  })
})
describe('isNegativeZero tests', () => {
  it('returns true when SingleRepresentation is -0', () => {
    const rep = FloatConverter.ToSingle(-0)
    expect(FloatConverter.isNegativeZero(rep)).toBeTruthy()
  })
  it('returns false when SingleRepresentation is not -0', () => {
    const rep = FloatConverter.ToSingle(123)
    expect(FloatConverter.isNegativeZero(rep)).toBeFalsy()
  })
  it('returns true when DoubleRepresentation is -0', () => {
    const rep = FloatConverter.ToDouble(-0)
    expect(FloatConverter.isNegativeZero(rep)).toBeTruthy()
  })
  it('returns false when DoubleRepresentation is not -0', () => {
    const rep = FloatConverter.ToDouble(123)
    expect(FloatConverter.isNegativeZero(rep)).toBeFalsy()
  })
})
describe('isPositiveInfinity tests', () => {
  it('returns true when SingleRepresentation is +INF', () => {
    const rep = FloatConverter.ToSingle(Number.POSITIVE_INFINITY)
    expect(FloatConverter.isPositiveInfinity(rep)).toBeTruthy()
  })
  it('returns false when SingleRepresentation is not +INF', () => {
    const rep = FloatConverter.ToSingle(123)
    expect(FloatConverter.isPositiveInfinity(rep)).toBeFalsy()
  })
  it('returns true when DoubleRepresentation is +INF', () => {
    const rep = FloatConverter.ToDouble(Number.POSITIVE_INFINITY)
    expect(FloatConverter.isPositiveInfinity(rep)).toBeTruthy()
  })
  it('returns false when DoubleRepresentation is not +INF', () => {
    const rep = FloatConverter.ToDouble(123)
    expect(FloatConverter.isPositiveInfinity(rep)).toBeFalsy()
  })
})
describe('isNegativeInfinity tests', () => {
  it('returns true when SingleRepresentation is -INF', () => {
    const rep = FloatConverter.ToSingle(Number.NEGATIVE_INFINITY)
    expect(FloatConverter.isNegativeInfinity(rep)).toBeTruthy()
  })
  it('returns false when SingleRepresentation is not -INF', () => {
    const rep = FloatConverter.ToSingle(123)
    expect(FloatConverter.isNegativeInfinity(rep)).toBeFalsy()
  })
  it('returns true when DoubleRepresentation is -INF', () => {
    const rep = FloatConverter.ToDouble(Number.NEGATIVE_INFINITY)
    expect(FloatConverter.isNegativeInfinity(rep)).toBeTruthy()
  })
  it('returns false when DoubleRepresentation is not -INF', () => {
    const rep = FloatConverter.ToDouble(123)
    expect(FloatConverter.isNegativeInfinity(rep)).toBeFalsy()
  })
})
describe('isNAN tests', () => {
  it('returns true when SingleRepresentation is NAN', () => {
    const rep = FloatConverter.ToSingle(Number.NaN)
    expect(FloatConverter.IsNAN(rep)).toBeTruthy()
  })
  it('returns false when SingleRepresentation is not NAN', () => {
    const rep = FloatConverter.ToSingle(123)
    expect(FloatConverter.IsNAN(rep)).toBeFalsy()
  })
  it('returns true when DoubleRepresentation is NAN', () => {
    const rep = FloatConverter.ToDouble(Number.NaN)
    expect(FloatConverter.IsNAN(rep)).toBeTruthy()
  })
  it('returns false when DoubleRepresentation is not NAN', () => {
    const rep = FloatConverter.ToDouble(123)
    expect(FloatConverter.IsNAN(rep)).toBeFalsy()
  })
})
describe('isDenormalized tests', () => {
  it('returns true when SingleRepresentation is denormalized', () => {
    const rep = FloatConverter.ToSingle(1.083553e-38)
    expect(FloatConverter.isDenormalized(rep)).toBeTruthy()
  })
  it('returns false when SingleRepresentation is denormalized', () => {
    const rep = FloatConverter.ToSingle(123)
    expect(FloatConverter.isDenormalized(rep)).toBeFalsy()
  })
  it('returns true when DoubleRepresentation is denormalized', () => {
    const rep = FloatConverter.ToDouble(2.2e-308)
    expect(FloatConverter.isDenormalized(rep)).toBeTruthy()
  })
  it('returns false when DoubleRepresentation is not denormalized', () => {
    const rep = FloatConverter.ToDouble(123)
    expect(FloatConverter.IsNAN(rep)).toBeFalsy()
  })
})
describe('getProperty tests', () => {
  it('identifies +0', () => {
    const input = 0
    const sr = FloatConverter.ToSingle(input)
    const dr = FloatConverter.ToDouble(input)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.PositiveZero)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.PositiveZero)
  })
  it('identifies +0', () => {
    const input = -0
    const sr = FloatConverter.ToSingle(input)
    const dr = FloatConverter.ToDouble(input)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.NegativeZero)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.NegativeZero)
  })
  it('identifies +INF', () => {
    const input = Number.POSITIVE_INFINITY
    const sr = FloatConverter.ToSingle(input)
    const dr = FloatConverter.ToDouble(input)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.PositiveInfinity)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.PositiveInfinity)
  })
  it('identifies -INF', () => {
    const input = Number.NEGATIVE_INFINITY
    const sr = FloatConverter.ToSingle(input)
    const dr = FloatConverter.ToDouble(input)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.NegativeInfinity)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.NegativeInfinity)
  })
  it('identifies NAN', () => {
    const input = Number.NaN
    const sr = FloatConverter.ToSingle(input)
    const dr = FloatConverter.ToDouble(input)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.NAN)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.NAN)
  })
  it('identifies denormalized number', () => {
    const sr = FloatConverter.ToSingle(1.083553e-38)
    const dr = FloatConverter.ToDouble(2.2e-308)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.Denormalized)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.Denormalized)
  })
  it('identifies denormalized number', () => {
    const input = 345.56
    const sr = FloatConverter.ToSingle(input)
    const dr = FloatConverter.ToDouble(input)
    expect(FloatConverter.getProperty(sr)).toEqual(FloatProperty.Normalized)
    expect(FloatConverter.getProperty(dr)).toEqual(FloatProperty.Normalized)
  })
})
