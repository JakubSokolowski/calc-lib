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
  public radix: number = 10
  public valueInDecimal: BigNumber
  public complement: BaseComplement

  public integralDigits: string[] = []
  public fractionalDigits: string[] = []

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
  public stages: ConversionStage[] = []
  public type: ConversionType = ConversionType.DIRECT

  get result(): BaseRepresentation {
    return this.stages[this.stages.length - 1].result
  }

  public addStage(stage: ConversionStage): void {
    this.stages.push(stage)
    this.assignConversionType()
  }

  public concatConversion(conv: Conversion): void {
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
  public input: [string, number]
  public result: BaseRepresentation

  constructor(input: [string, number], result: BaseRepresentation) {
    this.input = input
    this.result = result
  }
}
export class ConversionToArbitrary extends ConversionToDecimal {
  public integralDivisors: string[]
  public fractionalMultipliers: string[]

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
  public fromNumber(
    num: number | BigNumber,
    resultBase: number,
    precision: number = 30
  ): Conversion {
    let decimalValue: BigNumber = new BigNumber(0)
    if (typeof num === 'number') {
      decimalValue = new BigNumber(num)
    }
    if (num instanceof BigNumber) {
      decimalValue = num
    }
    const sign = decimalValue.isNegative() ? '-' : ''
    const fractionVal = decimalValue.mod(1)
    const integerVal = decimalValue.minus(fractionVal)
    const integerDigits = decimalIntegralToArbitrary(integerVal, resultBase)
    const fractionDigits = decimalFractionToArbitrary(fractionVal, resultBase, precision)
    const repStr =
      integerDigits[0].join(resultBase > 36 ? ' ' : '') +
      '.' +
      fractionDigits[0].join(resultBase > 36 ? ' ' : '')
    const complement = ComplementConverter.getComplement(sign + repStr, resultBase)
    const result = new BaseRepresentation(
      resultBase,
      decimalValue,
      integerDigits[0],
      fractionDigits[0],
      complement
    )
    const conv = new Conversion()
    conv.addStage(
      new ConversionToArbitrary([num.toString(), 10], result, integerDigits[1], fractionDigits[1])
    )
    return conv
  }

  public fromString(
    valueStr: string,
    inputBase: number,
    resultBase: number,
    precision: number = 30
  ): Conversion {
    if (isValidString(valueStr, inputBase)) {
      const conv = new Conversion()
      let decimalValue = new BigNumber(0)
      if (isFloatingPointStr(valueStr)) {
        const valueParts = valueStr.split('.')
        const integerPart = arbitraryIntegralToDecimal(valueParts[0], inputBase)
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
      const complement = ComplementConverter.getComplement(decimalValue.toString(), resultBase)
      // Split into two str arrays - integral part digits arr and
      // fractional part digits arr
      const digits = toDigitLists(decimalValue)
      const inputInDecimal = new BaseRepresentation(
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
