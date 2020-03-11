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
    })

    it('constructor for all fields', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', 'not_used', 2013)

      expect(serialCollateral.type).toEqual(SerialCollateralType.MOTOR_VEHICLE)
      expect(serialCollateral.make).toEqual('Kawasaki')
      expect(serialCollateral.model).toEqual('KLR650')
      expect(serialCollateral.serial).toEqual('JKAKLEE17DDA58357')
      expect(serialCollateral.manufacturedHomeRegNumber).toEqual('not_used')
      expect(serialCollateral.year).toEqual(2013)
    })
  })

  describe('json fields', (): void => {
    it('fields mapped for empty constructor', (): void => {
      const serialCollateral = new SerialCollateralModel()

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })

    it('fields mapped for motor vehicle', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', undefined, 2013)

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })

    it('manufactured home registration number removed for motor vehicle', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', 'unused', 2013)
      const serialCollateralClean = new SerialCollateralModel(SerialCollateralType.MOTOR_VEHICLE, 'Kawasaki', 'KLR650',
        'JKAKLEE17DDA58357', undefined, 2013)

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateralClean)
    })

    it('fields mapped for registered manufactured home', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, undefined,
        undefined, undefined, 'MH12345')

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })

    it('unused fields removed for registered manufactured home', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED, 'unused',
        'unused', 'unused', 'MH12345', 1999)
      const serialCollateralClean = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_REGISTERED,
        undefined, undefined, undefined, 'MH12345')

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateralClean)
    })

    it('fields mapped for unregistered manufactured home', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED,
        undefined, undefined, '1234567890123456789012345')

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateral)
    })

    it('unused fields removed for unregistered manufactured home', (): void => {
      const serialCollateral = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED,
        'unused', 'unused', '1234567890123456789012345', 'unused', 1999)
      const serialCollateralClean = new SerialCollateralModel(SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED,
        undefined, undefined, '1234567890123456789012345')

      expect(SerialCollateralModel.fromJson(serialCollateral.toJson())).toEqual(serialCollateralClean)
    })
  })
})
