const vehicleTypeParser = (typeValue) => {
    const vehicleTypeData = {'t1': '1톤', 't25': '2.5톤', 'w25': '25톤 워킹'}
    return vehicleTypeData[typeValue]
}
export default vehicleTypeParser