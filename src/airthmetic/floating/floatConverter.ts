import { prependZeros } from '../conversionHelpers'
import { fromString } from '../positional/baseConverter'

export enum FloatProperty {
  Normalized,
  Denormalized,
  PositiveInfinity,
  NegativeInfinity,
  PositiveZero,
  NegativeZero,
  NAN
}

export abstract class FloatingRepresentation {
  exponentLength: number = 8
  mantissaLength: number = 23
  binaryLength: number = 32
  bias: number = 127
  binary: string = ''

  abstract get value(): number

  abstract get sign(): string

  abstract get exponent(): string

  abstract get mantissa(): string

  abstract get exponentEncoding(): number

  abstract get mantissaEncoding(): number

  abstract get exponentValue(): number

  abstract get mantissaValue(): number
}

export class SingleRepresentation extends FloatingRepresentation {
  constructor(str: string) {
    super()
    this.binary = str
  }

  get value() {
    return FloatConverter.BinaryStringToSingle(this.binary)
  }

  get sign() {
    return this.binary[0]
  }

  get exponent() {
    return this.binary.substr(1, this.exponentLength)
  }

  get mantissa() {
    return this.binary.substr(1 + this.exponentLength, this.mantissaLength)
  }

  get exponentEncoding() {
    return Number.parseInt(this.exponent, 2)
  }

  get mantissaEncoding() {
    return Number.parseInt('0' + this.mantissa, 2)
  }

  get exponentValue() {
    return this.exponentEncoding - this.bias
  }

  get mantissaValue() {
    return fromString('1.' + this.mantissa, 2, 10).result.valueInDecimal.toNumber()
  }
}

export class DoubleRepresentation extends SingleRepresentation {
  exponentLength = 11
  mantissaLength = 52
  binaryLength = 64
  bias = 1023

  get value() {
    return FloatConverter.BinaryStringToDouble(this.binary)
  }
}

export class FloatConverter {
  static ToSingle(val: number | string): SingleRepresentation {
    let str = ''
    if (typeof val === 'number') {
      str = this.SingleToBinaryString(val)
    } else {
      str = val
    }
    return new SingleRepresentation(str)
  }

  static ToDouble(val: number | string): DoubleRepresentation {
    let str = ''
    if (typeof val === 'number') {
      str = this.DoubleToBinaryString(val)
    } else {
      str = val
    }
    return new DoubleRepresentation(str)
  }

  static DoubleToBinaryString(d: number): string {
    let buffer = new ArrayBuffer(8)
    let doubleView = new Float64Array(buffer)
    let intView = new Int32Array(buffer)
    doubleView[0] = d
    let low = (intView[0] >>> 0).toString(2)
    let high = (intView[1] >>> 0).toString(2)
    low = prependZeros(low, 32)
    high = prependZeros(high, 32)
    return high + low
  }

  static BinaryStringToDouble(s: string): number {
    let low = Number.parseInt(s.substr(0, 32), 2)
    let high = Number.parseInt(s.substr(32), 2)
    let buffer = new Buffer(8)
    buffer.writeInt32BE(low, 0)
    buffer.writeInt32BE(high, 4)
    return buffer.readDoubleBE(0)
  }

  static SingleToBinaryString(f: number): string {
    let buffer = new ArrayBuffer(4)
    let intView = new Int32Array(buffer)
    let floatView = new Float32Array(buffer)
    floatView[0] = f
    return prependZeros((intView[0] >>> 0).toString(2), 32)
  }

  static BinaryStringToSingle(s: string): number {
    let num = Number.parseInt(s, 2)
    let buffer = new Buffer(4)
    buffer.writeInt32BE(num, 0)
    return buffer.readFloatBE(0)
  }

  static getProperty(representation: FloatingRepresentation): FloatProperty {
    if (this.isPositiveZero(representation)) {
      return FloatProperty.PositiveZero
    }
    if (this.isNegativeZero(representation)) {
      return FloatProperty.NegativeZero
    }
    if (this.isPositiveInfinity(representation)) {
      return FloatProperty.PositiveInfinity
    }
    if (this.isNegativeInfinity(representation)) {
      return FloatProperty.NegativeInfinity
    }
    if (this.isDenormalized(representation)) {
      return FloatProperty.Denormalized
    }
    if (this.IsNAN(representation)) {
      return FloatProperty.NAN
    }
    return FloatProperty.Normalized
  }

  static isPositiveZero(representation: FloatingRepresentation): boolean {
    return (
      representation.sign === '0' &&
      /^0*$/.test(representation.exponent) &&
      /^0*$/.test(representation.mantissa)
    )
  }

  static isNegativeZero(representation: FloatingRepresentation): boolean {
    return (
      representation.sign === '1' &&
      /^0*$/.test(representation.exponent) &&
      /^0*$/.test(representation.mantissa)
    )
  }

  static isDenormalized(representation: FloatingRepresentation): boolean {
    return /^0*$/.test(representation.exponent) && !/^0*$/.test(representation.mantissa)
  }

  static isPositiveInfinity(representation: FloatingRepresentation): boolean {
    return (
      representation.sign === '0' &&
      /^1*$/.test(representation.exponent) &&
      /^0*$/.test(representation.mantissa)
    )
  }

  static isNegativeInfinity(representation: FloatingRepresentation): boolean {
    return (
      representation.sign === '1' &&
      /^1*$/.test(representation.exponent) &&
      /^0*$/.test(representation.mantissa)
    )
  }

  static IsNAN(representation: FloatingRepresentation): boolean {
    return /^1*$/.test(representation.exponent) && !/^0*$/.test(representation.mantissa)
  }
}
