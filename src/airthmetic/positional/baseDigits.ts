export class BaseDigits {
  static readonly MAX_RADIX: number = 99
  static readonly defaultDigits: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  static isValidRadix(radix: number): boolean {
    return radix >= 2 && radix <= this.MAX_RADIX
  }

  static getDigit(value: number, radix: number): string {
    if (!this.isValidRadix(radix)) {
      throw new Error('Radix must be between 2 and ')
    }
    if (value < radix) {
      if (radix <= 36) {
        return this.defaultDigits[value]
      }
      return value < 10 ? '0' + value.toString() : value.toString()
    }
    throw new Error('The value ' + value + ' is not in range 0 - ' + (radix - 1).toString())
  }

  static getValue(key: string, radix: number): number {
    if (!this.isValidRadix(radix)) {
      throw new Error('Radix must be between 2 and ')
    }
    let value = 0
    if (radix <= 36) {
      value = this.defaultDigits.indexOf(key)
    } else {
      value = parseInt(key, 10)
    }
    return value
  }
}
