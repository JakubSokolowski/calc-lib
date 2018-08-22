import { BaseConverter } from '../positional/baseConverter'
import { FloatConverter } from './floatConverter'

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
    return BaseConverter.fromValueString('1.' + this.mantissa, 2, 10).valueInDecimal.toNumber()
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
