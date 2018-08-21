import { BaseConverter } from '../positional/baseConverter'

export enum FloatProperty {
  Normalized,
  Denormalized,
  PositiveInfinity,
  NegativeInfinity,
  PositiveZero,
  NegativeZero,
  NAN
}

export class SingleRepresentation {
  exponentLength: number = 8
  mantissaLength: number = 23
  binaryLength: number = 32
  bias: number = 127
  property: FloatProperty
  binary: string

  constructor(str: string, property: FloatProperty) {
    this.binary = str
    this.property = property
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
    return BaseConverter.fromValueString('1.' + this.mantissa, 2, 10).valueInDecimal.toNumber()
  }

  get value() {
    let num = Number.parseInt(this.binary, 2)
    let buffer = new Buffer(4)
    console.log(buffer)
    buffer.writeInt32BE(num, 0)
    console.log(buffer)
    return buffer.readFloatBE(0)
  }
}

export class DoubleRepresentation extends SingleRepresentation {
  exponentLength = 11
  mantissaLength = 52
  binaryLength = 64
  bias = 1023

  get value() {
    let low = Number.parseInt(this.binary.substr(0, 32), 2)
    let high = Number.parseInt(this.binary.substr(32), 2)
    let buffer = new Buffer(8)
    buffer.writeInt32BE(low, 0)
    buffer.writeInt32BE(high, 4)
    return buffer.readDoubleBE(0)
  }
}
