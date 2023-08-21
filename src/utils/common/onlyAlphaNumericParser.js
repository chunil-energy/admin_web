const onlyAlphaNumericParser = (value) => {
    // const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
    const regex = /^[a-zA-Z0-9]+$/;
    const targetValue = value.toString()
    let resultArray = targetValue.split('').filter(char => regex.test(char));
    return resultArray.join('')
}

export default onlyAlphaNumericParser