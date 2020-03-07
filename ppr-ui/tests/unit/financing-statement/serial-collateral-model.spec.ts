import { SerialCollateralModel } from '@/financing-statement/serial-collateral-model'
import { SerialCollateralType } from '@/financing-statement/serial-collateral-type'

describe('serial-collateral-model.ts', (): void => {
  describe('construction', (): void => {
    it('empty constructor defaults', (): void => {
      const serialCollateral = new SerialCollateralModel()

      expect(serialCollateral.type).not.toBeDefined()
      expect(serialCollateral.make).not.toBeDefined()
      expect(serialCollateral.model).not.toBeDefined()
      expect(serialCollateral.serial).not.toBeDefined()
      expect(serialCollateral.manufacturedHomeRegNumber).not.toBeDefined()
      expect(serialCollateral.type).not.toBeDefined()

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })

    it('constructor for non-MH with all fields except MH#', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', undefined, 2013)

      expect(serialCollateral.type).toEqual(SerialCollateralType.MOTOR_VEHICLE)
      expect(serialCollateral.make).toEqual('Kawasaki')
      expect(serialCollateral.model).toEqual('KLR650')
      expect(serialCollateral.serial).toEqual('JKAKLEE17DDA58357')
      expect(serialCollateral.manufacturedHomeRegNumber).not.toBeDefined()
      expect(serialCollateral.year).toEqual(2013)

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })

    it('constructor for non-MH with all fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', 'somethingbad', 2013)

      expect(serialCollateral.manufacturedHomeRegNumber).toEqual('somethingbad')

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).not.toEqual(serialCollateral)
      expect(serialCollateral.toJson().manufacturedHomeRegNumber).not.toBeDefined()
    })

    it('constructor for MH with all fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME, 'Jandel Homes',
        'Beaufort', '16741', 'MH12345', 1971)

      expect(serialCollateral.type).toEqual(SerialCollateralType.MANUFACTURED_HOME)

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })
  })
})
