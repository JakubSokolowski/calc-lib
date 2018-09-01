export class BaseDigits {
  public static readonly MAX_RADIX: number = 99
  public static readonly defaultDigits: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  public static isValidRadix(radix: number): boolean {
    return radix >= 2 && radix <= this.MAX_RADIX
  }

  public static getDigit(value: number, radix: number): string {
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

  public static getValue(key: string, radix: number): number {
    if (!this.isValidRadix(radix)) {
      throw new Error('Radix must be between 2 and ')
    }
    return radix <= 36 ? this.defaultDigits.indexOf(key) : Number.parseInt(key, 10)
  }
}
