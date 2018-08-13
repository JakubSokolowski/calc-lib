export class BaseDigits {
  currentRadix: number = 10
  readonly MAX_RADIX: number = 99
  readonly defaultDigits: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  constructor(radix: number) {
    if (!this.isValidRadix(radix)) {
      throw new Error('Radix must be between 2 and ' + this.MAX_RADIX)
    }
    this.currentRadix = radix
  }
  isValidRadix(radix: number): boolean {
    return radix >= 2 && radix <= this.MAX_RADIX
  }
  getDigit(value: number): string {
    if (value < this.currentRadix) {
      if (this.currentRadix <= 36) {
        return this.defaultDigits[value]
      }
      return value < 10 ? '0' + value.toString() : value.toString()
    }
    throw new Error(
      'The value ' + value + ' is not in range 0 - ' + (this.currentRadix - 1).toString()
    )
  }
  getValue(key: string): number {
    let value = 0
    if (this.currentRadix <= 36) {
      value = this.defaultDigits.indexOf(key)
    } else {
      value = parseInt(key, 10)
    }
    return value
  }
}
