const vehiclePositionParser = (typeValue) => {
    const vehiclePositionData = {'sl': '소형 수집운반'}
    return vehiclePositionData[typeValue]
}
export default vehiclePositionParser