import { featureFlags } from '@/flags/feature-flags'

describe('feature-flags.ts', (): void => {
  it('has falsy default value for flag1', (): void => {
    expect(featureFlags.getFlag('flag1')).not.toBeTruthy()
  })

  it('has truthy value for flag1', (): void => {
    featureFlags.setFlag('flag1', true)

    expect(featureFlags.getFlag('flag1')).toBeTruthy()
  })

  it('has falsy value for reset flag1', (): void => {
    featureFlags.setFlag('flag1', true)
    featureFlags.setFlag('flag1', false)

    expect(featureFlags.getFlag('flag1')).not.toBeTruthy()
  })
})
