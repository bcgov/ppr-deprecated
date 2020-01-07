const mockAxios = jest.genMockFromModule('axios')

// console.log('Here in the jest axios mock class. Will redefine create so that future use of axios-auth can be mocked')
mockAxios.create = jest.fn(() => mockAxios)

export default mockAxios
