import { CollateralItemsModel } from '@/financing-statement/collateral-items-model'
import { SerialCollateralModel } from '@/financing-statement/serial-collateral-model'
import { SerialCollateralType } from '@/financing-statement/serial-collateral-type'

describe('collateral-items-model.ts', (): void => {
  describe('construction', (): void => {
    it('empty constructor defaults', (): void => {
      const collateralItems = new CollateralItemsModel()

      expect(collateralItems.serialCollateral).not.toBeDefined()
      expect(collateralItems.generalCollateral).not.toBeDefined()

      expect(CollateralItemsModel.fromJson(collateralItems.toJson())).toEqual(collateralItems)
    })

    it('constructor with all fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', undefined, 2013)
      const generalCollateral = 'This is some text defining general collateral'
      const collateralItems = new CollateralItemsModel([serialCollateral], generalCollateral)

      expect(CollateralItemsModel.fromJson(collateralItems.toJson())).toEqual(collateralItems)
    })

    it('constructor with extra field to be removed', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', 'this should be removed by the conversion to JSON', 2013)
      const generalCollateral = 'This is some text defining general collateral'
      const collateralItems = new CollateralItemsModel([serialCollateral], generalCollateral)

      expect(CollateralItemsModel.fromJson(collateralItems.toJson())).not.toEqual(collateralItems)
    })
  })
})
