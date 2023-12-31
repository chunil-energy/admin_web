const onlyDigitParser = (value) => {
    if (!value) {
        return null
    }
    const regex = /^[0-9]+$/;
    const targetValue = value.toString()
    let resultArray = targetValue.split('').filter(char => regex.test(char));
    return resultArray.join('')
}

export default onlyDigitParser