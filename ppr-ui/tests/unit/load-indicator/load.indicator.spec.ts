import { LoadIndicator } from '@/load-indicator'

describe('load-indicator.ts', (): void => {
  let loadIndicator: LoadIndicator

  beforeAll((): void => {
    loadIndicator = LoadIndicator.Instance
  })

  it('have instance', (): void => {
    expect(loadIndicator !== undefined)
  })

  it('is loading false', (): void => {
    expect(loadIndicator.isLoading() === false)
  })

  it('start', (): void => {
    loadIndicator.start()
    expect(loadIndicator.isLoading() === true)
  })

  it('stop', (): void => {
    loadIndicator.stop()
    expect(loadIndicator.isLoading() === false)
  })

})

