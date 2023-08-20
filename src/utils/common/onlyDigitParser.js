const onlyDigitParser = (value) => {
    const targetValue = value.toString()
    const digitIndex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let resultArrary = targetValue.split('').filter(char => digitIndex.indexOf(char) > -1);
    return resultArrary.join('')
}

export default onlyDigitParser