const vehicleVehicleDriverParser = (valueList) => {
    const index = valueList.findIndex((value) => value.current === true)
    if (index > -1) {
        return valueList[index]
    }
    return null
}
export default vehicleVehicleDriverParser