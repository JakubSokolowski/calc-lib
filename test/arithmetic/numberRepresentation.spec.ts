import { NumberRepresentation } from '../../src/airthmetic/numberRepresentation'

describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new NumberRepresentation()).toBeInstanceOf(NumberRepresentation)
  })
})
