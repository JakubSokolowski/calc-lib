import {
  DoubleRepresentation,
  FloatingRepresentation,
  FloatProperty,
  SingleRepresentation
} from './floatRepresentation'
import { prependZeros } from '../conversionHelpers'

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
    // let low = intView[0].toString(2);
    // let high = intView[1].toString(2);
    let low = (intView[0] >>> 0).toString(2)
    let high = (intView[1] >>> 0).toString(2)
    // if(high.startsWith('-')) {
    //   high = high.substring(1);
    //   high = prependStr('1', high, 32);
    // } else {
    //
    // }
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
