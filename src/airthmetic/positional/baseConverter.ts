import BigNumber from 'bignumber.js'
import {
  arbitraryFractionToDecimal,
  arbitraryIntegralToDecimal,
  decimalFractionToArbitrary,
  decimalIntegralToArbitrary,
  isFloatingPointStr,
  isValidString,
  toDigitLists
} from '../conversionHelpers'
import { BaseComplement, ComplementConverter } from './complementConverter'

export class BaseRepresentation {
  radix: number = 10
  valueInDecimal: BigNumber
  complement: BaseComplement

  integralDigits: string[] = []
  fractionalDigits: string[] = []

  constructor(
    radix: number,
    valInDecimal: BigNumber,
    integral: string[],
    fractional: string[],
    complement: BaseComplement
  ) {
    this.radix = radix
    this.valueInDecimal = valInDecimal
    this.integralDigits = integral
    this.fractionalDigits = fractional
    this.complement = complement
  }

  get valueInBase(): string {
    return (
      this.sign +
      this.integralDigits.join(this.radix > 36 ? ' ' : '') +
      this.delimiter +
      this.fractionalDigits.join(this.radix > 36 ? ' ' : '')
    )
  }

  get sign(): string {
    return this.valueInDecimal.isNegative() ? '-' : ''
  }

  get delimiter(): string {
    return this.fractionalDigits.length ? '.' : ''
  }
}
enum ConversionType {
  DIRECT,
  INDIRECT
}
export class Conversion {
  stages: ConversionStage[] = []
  type: ConversionType = ConversionType.DIRECT

  get result(): BaseRepresentation {
    return this.stages[this.stages.length - 1].result
  }

  addStage(stage: ConversionStage): void {
    this.stages.push(stage)
    this.assignConversionType()
  }

  concatConversion(conv: Conversion): void {
    this.stages = this.stages.concat(conv.stages)
    this.assignConversionType()
  }

  private assignConversionType(): void {
    this.type = this.stages.length > 1 ? ConversionType.INDIRECT : ConversionType.DIRECT
  }
}
interface ConversionStage {
  input: [string, number]
  result: BaseRepresentation
}

export class ConversionToDecimal implements ConversionStage {
  input: [string, number]
  result: BaseRepresentation

  constructor(input: [string, number], result: BaseRepresentation) {
    this.input = input
    this.result = result
  }
}
export class ConversionToArbitrary extends ConversionToDecimal {
  integralDivisors: string[]
  fractionalMultipliers: string[]

  constructor(
    input: [string, number],
    result: BaseRepresentation,
    divisors: string[],
    multipliers: string[]
  ) {
    super(input, result)
    this.integralDivisors = divisors
    this.fractionalMultipliers = multipliers
  }
}

export interface BaseConverter {
  fromNumber(num: number | BigNumber, resultBase: number, precision?: number): Conversion

  fromString(
    valueStr: string,
    inputBase: number,
    resultBase: number,
    precision?: number
  ): Conversion
}

export class StandardBaseConverter implements BaseConverter {
  fromNumber(num: number | BigNumber, resultBase: number, precision: number = 30): Conversion {
    let decimalValue: BigNumber = new BigNumber(0)
    if (typeof num === 'number') {
      decimalValue = new BigNumber(num)
    }
    if (num instanceof BigNumber) {
      decimalValue = num
    }
    let sign = decimalValue.isNegative() ? '-' : ''
    let fractionVal = decimalValue.mod(1)
    let integerVal = decimalValue.minus(fractionVal)
    let integerDigits = decimalIntegralToArbitrary(integerVal, resultBase)
    let fractionDigits = decimalFractionToArbitrary(fractionVal, resultBase, precision)
    let repStr =
      integerDigits[0].join(resultBase > 36 ? ' ' : '') +
      '.' +
      fractionDigits[0].join(resultBase > 36 ? ' ' : '')
    let complement = ComplementConverter.getComplement(sign + repStr, resultBase)
    let result = new BaseRepresentation(
      resultBase,
      decimalValue,
      integerDigits[0],
      fractionDigits[0],
      complement
    )
    let conv = new Conversion()
    conv.addStage(
      new ConversionToArbitrary([num.toString(), 10], result, integerDigits[1], fractionDigits[1])
    )
    return conv
  }

  fromString(
    valueStr: string,
    inputBase: number,
    resultBase: number,
    precision: number = 30
  ): Conversion {
    if (isValidString(valueStr, inputBase)) {
      let conv = new Conversion()
      let decimalValue = new BigNumber(0)
      if (isFloatingPointStr(valueStr)) {
        let valueParts = valueStr.split('.')
        let integerPart = arbitraryIntegralToDecimal(valueParts[0], inputBase)
        let fractionalPart = arbitraryFractionToDecimal(valueParts[1], inputBase)
        // Make the fractionalPart negative if the integer part is also negative
        // This is needed when both parts are added together to create whole value
        if (integerPart.isNegative()) {
          fractionalPart = fractionalPart.negated()
        }
        decimalValue = integerPart.plus(fractionalPart)
      } else {
        decimalValue = arbitraryIntegralToDecimal(valueStr, inputBase)
      }
      let complement = ComplementConverter.getComplement(decimalValue.toString(), resultBase)
      // Split into two str arrays - integral part digits arr and
      // fractional part digits arr
      let digits = toDigitLists(decimalValue)
      let inputInDecimal = new BaseRepresentation(
        10,
        decimalValue,
        digits[0],
        digits[1],
        complement
      )
      conv.addStage(new ConversionToDecimal([valueStr, inputBase], inputInDecimal))
      if (resultBase === 10) {
        return conv
      }
      conv.concatConversion(this.fromNumber(inputInDecimal.valueInDecimal, resultBase))
      return conv
    } else {
      throw new Error('The string does not match the radix')
    }
  }
}

export function fromNumber(
  num: number | BigNumber,
  resultBase: number,
  precision: number = 30,
  converter: BaseConverter = new StandardBaseConverter()
): Conversion {
  return converter.fromNumber(num, resultBase, precision)
}

export function fromString(
  valueStr: string,
  inputBase: number,
  resultBase: number,
  precision: number = 30,
  converter: BaseConverter = new StandardBaseConverter()
): Conversion {
  return converter.fromString(valueStr, inputBase, resultBase, precision)
}
