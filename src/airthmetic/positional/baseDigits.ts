export class BaseDigits {
  currentRadix: number = 10
  readonly MAX_RADIX: number = 99
  readonly defaultDigits: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  digitValues: { [key: string]: number } = {}
  digitValuesUpToRadix36: { [key: string]: number } = {}

  constructor(radix: number) {
    if (!this.isValidRadix(radix)) {
      throw new Error('Radix must be between 2 and ' + this.MAX_RADIX)
    }
    this.currentRadix = radix
    this.fillDigits()
  }

  isValidRadix(radix: number): boolean {
    return radix >= 2 && radix <= this.MAX_RADIX
  }

  fillDigits(): void {
    for (let i = 0; i <= 36; i++) {
      this.digitValuesUpToRadix36[this.defaultDigits.charAt(i)] = i
    }
    if (this.currentRadix > 36) {
      for (let i = 0; i <= this.currentRadix; i++) {
        let key = i.toString()
        if (i < 10) {
          key = '0' + key
        }
        this.digitValues[key] = i
      }
    }
  }

  getKeyByValue(obj: any, value: number): string {
    return String(Object.keys(obj).find(key => obj[key] === value))
  }

  getDigit(value: number): string {
    if (value < this.currentRadix) {
      if (this.currentRadix <= 36) {
        return this.getKeyByValue(this.digitValuesUpToRadix36, value)
      } else {
        return this.getKeyByValue(this.digitValues, value)
      }
    }
    throw new Error('The digit is not in range 0 - ' + (this.currentRadix - 1).toString())
  }

  getValue(key: string): number {
    let value = 0
    if (this.currentRadix <= 36) {
      value = this.digitValuesUpToRadix36[key]
    } else {
      value = this.digitValues[key]
    }
    return value
  }
}
