import { BigNumber } from 'bignumber.js'

interface MathOperations<T> {
  add(num: T): T

  subtract(num: T): T

  multiply(num: T): T

  divide(num: T): T
}

export class NumberRepresentation {
  valueInDecimal: BigNumber = new BigNumber(0)
  valueInBaseStr: string = '0.0'
  complementStr: string = '0.0'
  singleRepStr: string = '0'
  doubleRepStr: string = '0'
  numBase: number = 0

  constructor(decVal: BigNumber, radix: number) {}
}
