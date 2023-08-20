const onlyKorNumberParser = (value) => {
    // const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
    const regex = /^[ㄱ-ㅎ가-힣0-9]+$/;
    const targetValue = value.toString()
    let resultArray = targetValue.split('').filter(char => regex.test(char));
    console.log(resultArray)
    return resultArray.join('')
}

export default onlyKorNumberParser